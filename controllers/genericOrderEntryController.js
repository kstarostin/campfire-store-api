const GenericOrderEntry = require('../models/genericOrderEntryModel');
const Product = require('../models/productModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const DocumentSanitizer = require('../utils/documentSanitizer');

/**
 * Calculate total entry price based on the product price filtered by the cart currency and the quantity.
 * @param {*} cart the cart object.
 * @param {*} productId the product ID in the entry.
 * @param {*} quantity the product quantity in the entry.
 * @returns calculated total price of the cart / order entry.
 */
const calculateEntryPrice = async function (cart, productId, quantity, next) {
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    return next(
      new AppError(`Can not find a product by ID ${productId}.`, 404),
    );
  }

  const { currency } = cart;
  const price = product.prices.find((pr) => pr.currency === currency);
  if (!price || !price.value) {
    return next(
      new AppError(
        `The product ${product.id} doesn't have a valid price for the session cart currency ${currency}`,
        500,
      ),
    );
  }
  return price.value * quantity;
};

exports.assignEntryToCart = (req, res, next) => {
  if (!req.body.parent) {
    req.body.parent = req.params.cartId
      ? req.params.cartId
      : req.params.orderId;
  }
  next();
};

exports.getAllEntries = factory.getAll(GenericOrderEntry, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getEntry = factory.getOne(GenericOrderEntry);

exports.createEntry = catchAsync(async (req, res, next) => {
  // Adjust entry price in the payload based on the product and cart currency
  if (req.params.cartId) {
    req.body.price = await calculateEntryPrice(
      req.cart,
      req.body.product,
      req.body.quantity,
      next,
    );
  }
  // Create a new cart / order entry
  let newDocument = await GenericOrderEntry.create(req.body);
  newDocument = new DocumentSanitizer(req.language, req.currency, 3).sanitize(
    newDocument,
  );
  // Recalculate cart after entry modification
  await req.cart?.recalculate();

  res.status(201).json({
    status: 'success',
    data: {
      data: newDocument,
    },
  });
});

exports.updateEntry = catchAsync(async (req, res, next) => {
  // To allow for nested GET objects on user
  const filter = {
    parent: req.params.cartId ? req.params.cartId : req.params.orderId,
    _id: req.params.entryId,
  };
  const document = await GenericOrderEntry.findOne(filter);
  if (!document) {
    return next(new AppError('No document found with this ID', 404));
  }
  // Adjust entry price in the payload based on the product and cart currency
  if (req.params.cartId && req.body.quantity) {
    req.body.price = await calculateEntryPrice(
      req.cart,
      document.product,
      req.body.quantity,
      next,
    );
  }
  // Cart entry product can't be changed
  req.body.product = undefined;

  let updatedDocument = await GenericOrderEntry.findByIdAndUpdate(
    filter,
    { ...req.body, ...{ updatedAt: Date.now() } },
    {
      new: true,
      runValidators: true,
    },
  );
  // Recalculate cart after entry modification
  await req.cart?.recalculate();

  updatedDocument = new DocumentSanitizer(
    req.language,
    req.currency,
    3,
  ).sanitize(updatedDocument);

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedDocument,
    },
  });
});

exports.deleteEntry = catchAsync(async (req, res, next) => {
  // To allow for nested GET objects on user
  const filter = {
    parent: req.params.cartId ? req.params.cartId : req.params.orderId,
    _id: req.params.entryId,
  };

  const document = await GenericOrderEntry.findOneAndDelete(filter);

  if (!document) {
    return next(new AppError('No document found with this ID', 404));
  }
  // Recalculate cart after entry modification
  await req.cart?.recalculate();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
