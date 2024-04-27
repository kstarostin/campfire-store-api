const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const { promisify } = require('util');
const User = require('../models/userModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const DocumentSanitizer = require('../utils/documentSanitizer');
const RequestBodySanitizer = require('../utils/requestBodySanitizer');
const ImagePathBuilder = require('../utils/imagePathBuilder');
const {
  allowedImageMimeTypes,
  imageDimensionsMap,
} = require('../utils/config');

const unlinkAsync = promisify(fs.unlink);
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (allowedImageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Allowed image mime types are [${allowedImageMimeTypes.join(', ')}].`,
        400,
      ),
      false,
    );
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const createImageFile = async (options) => {
  // Get image side size by its name
  const size = +imageDimensionsMap.get(options.sizeName);
  // Build path for an image
  const imagePath = new ImagePathBuilder()
    .for(options.resource)
    .size(options.sizeName)
    .name(options.name)
    .mime(`image/jpeg`)
    .build();
  // Create the file
  await sharp(options.file.buffer)
    .resize(size, size)
    .flatten({ background: '#ffffff' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/${imagePath}`);
  return imagePath;
};

// Checks if the ID matches the MongoDB ID format to avoud casting errors.
const isValidId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

exports.getAllUsers = factory.getAll(User, {
  defaultLimit: 25,
  maxLimit: 100,
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /users/signup instead',
  });
};

/**
 * Function to get an exact user by requested ID or email.
 * @returns a successful response with the found user, if such exists, or an error response.
 */
exports.getUser = catchAsync(async (req, res, next) => {
  let user = isValidId(req.params.userId)
    ? await User.findById({ _id: req.params.userId })
    : await User.findOne({
        email: req.params.userId,
      });
  if (!user) {
    return next(new AppError('No user found with this ID or email', 404));
  }
  user = new DocumentSanitizer(req.language, req.currency, 6).sanitize(user);
  res.status(200).json({
    status: 'success',
    data: {
      document: user,
    },
  });
});

/**
 * Function to update an exact user by requested ID or email.
 * @returns a successful response with the found user, if such exists, or an error response.
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  // Search for a user by ID or email
  const user = isValidId(req.params.userId)
    ? await User.findById(req.params.userId)
    : await User.findOne({ email: req.params.userId });

  // Check existence
  if (!user) {
    return next(new AppError('No user found with this ID or email', 404));
  }

  // Sanitize request body
  const sanitizerWhitelist = [
    'name',
    'email',
    'deliveryAddresses',
    'billingAddresses',
  ];
  // Additionally, make sure only admins can manage their roles
  if (req.user?.roles?.includes('admin')) {
    sanitizerWhitelist.push('roles');
  }
  // Sanitize request body
  req.body = new RequestBodySanitizer(sanitizerWhitelist).sanitize(req.body);

  // Check if user photo is being uploaded
  const imagesToRemove = [];
  if (req.imageThumbnail && req.imageSmall) {
    req.body.photo = {
      thumbnail: {
        url: req.imageThumbnail.url,
        mimeType: req.imageThumbnail.mimeType,
      },
      small: {
        url: req.imageSmall.url,
        mimeType: req.imageSmall.mimeType,
      },
    };
    // Mark old photo images for delete if not placeholders
    if (!user.photo?.thumbnail?.url?.includes('user_photo_placeholder')) {
      imagesToRemove.push(`public/${user.photo.thumbnail.url}`);
    }
    if (!user.photo?.small?.url?.includes('user_photo_placeholder')) {
      imagesToRemove.push(`public/${user.photo.small.url}`);
    }
  }

  // Forbid changing passwords on this route
  if (req.body.password) {
    return next(
      new AppError('This route does not allow changing passwords.', 400),
    );
  }

  // Perform update
  let updatedUser = await User.findByIdAndUpdate(
    user.id,
    { ...req.body, ...{ updatedAt: Date.now() } },
    {
      new: true,
      runValidators: true,
    },
  );

  // Delete old photo images, if any
  await Promise.all(
    imagesToRemove.map(async (image) => {
      await unlinkAsync(image);
    }),
  );

  // Sanitize response document
  updatedUser = new DocumentSanitizer(req.language, req.currency, 6).sanitize(
    updatedUser,
  );

  res.status(200).json({
    status: 'success',
    data: {
      document: updatedUser,
    },
  });
});

/**
 * Function to delete an exact user by requested ID or email.
 * @returns a successful response, if the user was found and deleted, or an error response.
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = isValidId(req.params.userId)
    ? await User.findByIdAndDelete(req.params.userId)
    : await User.findOneAndDelete({ email: req.params.userId });
  if (!user) {
    return next(new AppError('No user found with this ID or email', 404));
  }
  res.status(204).json({
    status: 'success',
    data: {
      document: null,
    },
  });
});

/**
 * Function to store an attached file in to the memory.
 */
exports.uploadUserPhoto = upload.single('photo');

/**
 * Function resize the stored file in two sizes (thumbnail and small) and save them in the file storage.
 */
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  // Result file mime type
  const mimeType = 'image/jpeg';
  // Build base image file name
  const imageName = `user-${req.user.id}-${Date.now()}`;

  // Create file for a thumbnail image
  const imageThumbnailPath = await createImageFile({
    file: req.file,
    resource: 'user',
    name: imageName,
    sizeName: 'thumbnail',
  });
  // Save the new file meta in request for further usage
  req.imageThumbnail = {
    url: imageThumbnailPath,
    mimeType,
  };

  // Create file for a small image
  const imageSmallPath = await createImageFile({
    file: req.file,
    resource: 'user',
    name: imageName,
    sizeName: 'small',
  });
  // Save the new file meta in request for further usage
  req.imageSmall = {
    url: imageSmallPath,
    mimeType,
  };

  next();
});

/**
 * Function to delete a user's photo by requested user ID or email.
 * @returns a successful response, if the user was found and the non-placeholder photo was deleted. Otherwise, an error response.
 */
exports.deleteUserPhoto = catchAsync(async (req, res, next) => {
  // Search for a user by ID or email
  const user = isValidId(req.params.userId)
    ? await User.findById(req.params.userId)
    : await User.findOne({ email: req.params.userId });

  // Check existence
  if (!user) {
    return next(new AppError('No user found with this ID or email', 404));
  }

  // Validate an existing photo
  if (
    user.photo.id !== req.params.photoId ||
    user.photo?.thumbnail?.url?.length === 0 ||
    user.photo?.thumbnail?.url?.includes('user_photo_placeholder') ||
    user.photo?.small?.url?.length === 0 ||
    user.photo?.small?.url?.includes('user_photo_placeholder')
  ) {
    return next(
      new AppError('User does not have a valid uploaded photo to remove.', 400),
    );
  }

  // Mark old photo images for delete
  const imagesToRemove = [];
  imagesToRemove.push(`public/${user.photo.thumbnail.url}`);
  imagesToRemove.push(`public/${user.photo.small.url}`);

  // Replace user photo with placeholder
  user.photo = {
    small: {
      url: new ImagePathBuilder().for('user').size('small').build(),
      altText: `${user.name} photo`,
      mimeType: 'image/png',
    },
    thumbnail: {
      url: new ImagePathBuilder().for('user').size('thumbnail').build(),
      altText: `${user.name} photo`,
      mimeType: 'image/png',
    },
  };
  user.updatedAt = Date.now();

  // Perform update
  await User.findByIdAndUpdate(user.id, user, {
    new: true,
    runValidators: true,
  });

  // Delete old photo images, if any
  await Promise.all(
    imagesToRemove.map(async (image) => {
      await unlinkAsync(image);
    }),
  );

  res.status(204).json({
    status: 'success',
    data: {
      document: null,
    },
  });
});
