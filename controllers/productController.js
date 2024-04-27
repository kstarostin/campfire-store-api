const multer = require('multer');
const Product = require('../models/productModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const DocumentSanitizer = require('../utils/documentSanitizer');
const RequestBodySanitizer = require('../utils/requestBodySanitizer');
const AppError = require('../utils/appError');
const { createImageFile } = require('../utils/fileUtils');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(
      new AppError('Allowed product image mime types are [image/webp].', 400),
      false,
    );
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.getAllProducts = factory.getAll(Product, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getProduct = factory.getOne(Product, [{ path: 'category' }]);
exports.createProduct = factory.createOne(Product, [
  'name',
  'descriptionI18n',
  'prices',
  'manufacturer',
  'category',
]);

/**
 * Function to store a attached image files in to the memory.
 */
exports.uploadProductImages = upload.fields([
  {
    name: 'images',
    maxCount: 3,
  },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) {
    return next();
  }
  req.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      // Current image number
      const index = i + 1;
      // Result file mime type
      let mimeType = 'image/jpeg';
      // Result file format
      let format = 'jpeg';
      // Build base image file name
      const imageName = `product-${req.params.id}-${Date.now()}-${index}`;

      // Create file for a thumbnail image
      const imageThumbnailPath = await createImageFile({
        file,
        resource: 'product',
        name: imageName,
        sizeName: 'thumbnail',
        format,
      });

      // Create file for a small image
      const imageSmallPath = await createImageFile({
        file,
        resource: 'product',
        name: imageName,
        sizeName: 'small',
        format,
      });

      // Create file for a medium image
      const imageMediumPath = await createImageFile({
        file,
        resource: 'product',
        name: imageName,
        sizeName: 'medium',
        format,
      });

      // Save the new file meta in request for further usage
      const image = {
        thumbnail: {
          url: imageThumbnailPath,
          mimeType,
        },
        small: {
          url: imageSmallPath,
          mimeType,
        },
        medium: {
          url: imageMediumPath,
          mimeType,
        },
      };
      // Switch to .webp for larger images
      mimeType = 'image/webp';
      format = 'webp';

      // Create file for a large image
      const imageLargePath = await createImageFile({
        file,
        resource: 'product',
        name: imageName,
        sizeName: 'large',
        format,
      });

      // Create file for an original image
      const imageOriginalPath = await createImageFile({
        file,
        resource: 'product',
        name: imageName,
        sizeName: 'original',
        format,
      });

      // Add the rest file meta in request for further usage
      image.large = {
        url: imageLargePath,
        mimeType,
      };
      image.original = {
        url: imageOriginalPath,
        mimeType,
      };

      req.images.push(image);
    }),
  );

  next();
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // Check existence
  if (!product) {
    return next(new AppError('No product found with this ID.', 404));
  }

  // Sanitize request body
  const sanitizerWhitelist = [
    'name',
    'descriptionI18n',
    'prices',
    'manufacturer',
    'category',
  ];
  req.body = new RequestBodySanitizer(sanitizerWhitelist).sanitize(req.body);

  // Check if product photos are being uploaded
  if (req.images) {
    req.body.images = product.images;
    req.body.images.push(...req.images);
  }

  // Perform update
  let updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body, ...{ updatedAt: Date.now() } },
    {
      new: true,
      runValidators: true,
    },
  );

  // Sanitize response document
  updatedProduct = new DocumentSanitizer(
    req.language,
    req.currency,
    5,
  ).sanitize(updatedProduct);

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedProduct,
    },
  });
});

// exports.updateProduct = factory.updateOne(Product, [
//   'name',
//   'descriptionI18n',
//   'prices',
//   'manufacturer',
//   'category',
// ]);
exports.deleteProduct = factory.deleteOne(Product);
