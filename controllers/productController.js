const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const Product = require('../models/productModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const DocumentSanitizer = require('../utils/documentSanitizer');
const RequestBodySanitizer = require('../utils/requestBodySanitizer');
const AppError = require('../utils/appError');
const { createImageFile } = require('../utils/fileUtils');
const Category = require('../models/categoryModel');

const unlinkAsync = promisify(fs.unlink);

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

/**
 * Validates request parameter id for category and populates found category in to the request.
 * If the category is root, then finds all child categories and populates them for filter usage as well.
 */
exports.handleCategoryId = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(
      new AppError('Required parameter id for this request is missing.', 400),
    );
  }
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('No category found with this ID.', 404));
  }
  const categories = [];
  categories.push(category);
  if (category.root) {
    const childCategories = await Category.find({
      parentCategory: category.id,
    });
    categories.push(...childCategories);
  }
  req.categories = categories;

  next();
});

/**
 * Get all products. If the request contains category id, then returns a list of products for this category.
 * If the category is a root category, then performs searching for it's child categories.
 */
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.categories) {
    filter.category = { $in: req.categories.map((category) => category.id) };
  }
  // EXECUTE QUERY
  const features = new APIFeatures(Product.find(filter), req.query)
    .paginate({ defaultLimit: 25, maxLimit: 50 })
    .sort()
    .limitFields()
    .filter();
  // Retrieve total count of documents. If filter is empty - use more efficient way.
  const totalCount =
    Object.keys(filter).length === 0 && filter.constructor === Object
      ? await Product.estimatedDocumentCount()
      : await Product.countDocuments(filter);
  // const documents = await features.dbQuery.explain();
  const documents = (await features.dbQuery).map((document) =>
    new DocumentSanitizer(req.language, req.currency, 8).sanitize(document),
  );

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    resultsFound: documents.length,
    resultsPerPage: features.limit,
    resultsTotal: totalCount,
    currentPage: features.page,
    data: {
      documents,
    },
  });
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
    maxCount: 5,
  },
]);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.params.id || !req.files.images) {
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

exports.validateExistence = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // Check existence
  if (!product) {
    return next(new AppError('No product found with this ID.', 404));
  }
  next();
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

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

exports.deleteProduct = factory.deleteOne(Product);

/**
 * Function to delete a product image by requested user ID or email.
 * @returns a successful response, if the image was deleted. Otherwise, an error response.
 */
exports.deleteProductImage = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // Check product existence
  if (!product) {
    return next(new AppError('No product found with this ID.', 404));
  }

  const existingImage = product.images.find(
    (image) => image.id === req.params.imageId,
  );
  // Check image existence
  if (!existingImage) {
    return next(
      new AppError('Product does not have an image with this ID.', 404),
    );
  }

  // Mark old photo images for delete
  const imagesToRemove = [];
  if (existingImage.thumbnail?.url) {
    imagesToRemove.push(`public/${existingImage.thumbnail.url}`);
  }
  if (existingImage.small?.url) {
    imagesToRemove.push(`public/${existingImage.small.url}`);
  }
  if (existingImage.medium?.url) {
    imagesToRemove.push(`public/${existingImage.medium.url}`);
  }
  if (existingImage.large?.url) {
    imagesToRemove.push(`public/${existingImage.large.url}`);
  }
  if (existingImage.original?.url) {
    imagesToRemove.push(`public/${existingImage.original.url}`);
  }

  // Delete images, if any
  await Promise.all(
    imagesToRemove.map(async (image) => {
      await unlinkAsync(image);
    }),
  );

  // Perform update
  req.body.images = product.images.filter(
    (image) => image.id !== req.params.imageId,
  );
  req.body.updatedAt = Date.now();

  await Product.findByIdAndUpdate(product.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(204).json({
    status: 'success',
    data: {
      document: null,
    },
  });
});
