const WishlistEntry = require('../models/wishlistEntryModel');
const Product = require('../models/productModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const DocumentSanitizer = require('../utils/documentSanitizer');
const RequestBodySanitizer = require('../utils/requestBodySanitizer');

exports.assignEntryToWishlist = (req, res, next) => {
  if (!req.body.parent) {
    req.body.parent = req.params.wishlistId;
  }
  next();
};

exports.getAllEntries = factory.getAll(WishlistEntry, {
  defaultLimit: 25,
  maxLimit: 100,
});
exports.getEntry = factory.getOne(WishlistEntry);

exports.createEntry = catchAsync(async (req, res, next) => {
  req.body = new RequestBodySanitizer(['product', 'parent']).sanitize(req.body);

  const product = await Product.findById(req.body.product);
  if (!product) {
    return next(
      new AppError(`Can not find a product by ID ${req.body.product}.`, 404),
    );
  }

  const existingEntry = await WishlistEntry.findOne({
    parent: req.body.parent,
    product: req.body.product,
  });
  if (existingEntry) {
    return next(
      new AppError('This product is already in the wishlist.', 409),
    );
  }

  let newDocument = await WishlistEntry.create(req.body);
  newDocument = new DocumentSanitizer(req.language, req.currency, 3).sanitize(
    newDocument,
  );

  res.status(201).json({
    status: 'success',
    data: {
      document: newDocument,
    },
  });
});

exports.deleteEntry = catchAsync(async (req, res, next) => {
  const filter = {
    parent: req.params.wishlistId,
    _id: req.params.entryId,
  };

  const document = await WishlistEntry.findOneAndDelete(filter);

  if (!document) {
    return next(new AppError('No document found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
