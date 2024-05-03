const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Cart = require('../models/cartModel');
const GenericOrderEntry = require('../models/genericOrderEntryModel');
const Product = require('../models/productModel');
const factory = require('./controllerFactory');
const { allowedCurrencies } = require('../utils/config');
const RequestBodySanitizer = require('../utils/requestBodySanitizer');

const updateEntryPrice = async function (entry, newCurrency) {
  const product = await Product.findById(entry.product);
  entry.price = product.prices.find((pr) => pr.currency === newCurrency).value;
  await entry.save();
  return entry;
};

/**
 * Validates if the cart can be switched to a different currency. Changes prices of all cart entries.
 * @param {*} cart the current cart.
 * @param {*} newCurrency the currency to switch to.
 * @returns true if cart and entries were switched to the new currency.
 */
const changeCartEntriesCurrency = async function (cart, newCurrency, next) {
  // Validate new currency value
  if (!allowedCurrencies.includes(newCurrency)) {
    return next(
      new AppError(
        `Allowed currencies are [${allowedCurrencies.join(', ')}].`,
        400,
      ),
    );
  }
  // Validate availability of entry prices for the new currency
  const entries = await GenericOrderEntry.find({ parent: cart.id });
  const productIds = entries?.map((entry) => entry.product);
  const invalidProducts = (
    await Product.find({ _id: { $in: productIds } })
  ).filter((product) => {
    const newPrice = product.prices.find((pr) => pr.currency === newCurrency);
    return !newPrice || !newPrice.value || newPrice.value === 0;
  });
  if (invalidProducts.length > 0) {
    return next(
      new AppError(
        `The following entry products have no valid prices for the new currency ${newCurrency}: [${invalidProducts.map((product) => product.id).join(', ')}].`,
        400,
      ),
    );
  }
  // Update price value for each entry
  await Promise.all(
    entries.map((entry) => updateEntryPrice(entry, newCurrency)),
  );
  return true;
};

/**
 * Check that user has no existing carts.
 */
exports.oneSessionCartAllowed = catchAsync(async (req, res, next) => {
  if (!req.params.userId) {
    return next();
  }
  if ((await Cart.countDocuments({ user: req.params.userId })) > 0) {
    return next(
      new AppError(
        `The user with ID ${req.params.userId} already have a cart. One cart is allowed per user.`,
        400,
      ),
    );
  }
  next();
});

exports.assignUserToCart = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.params.userId;
  }
  next();
};

exports.getAllCarts = factory.getAll(Cart, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getCart = factory.getOne(Cart);

exports.createCart = catchAsync(async (req, res, next) => {
  // Assign request param currency or the default currency if nothing is specified in the payload
  if (!req.body.currency) {
    req.body.currency = req.currency;
  }
  // Create a new cart
  const newDocument = await Cart.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      document: newDocument,
    },
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  // To allow for nested GET objects on user
  const filter = {
    user: req.params.userId,
    _id: req.params.cartId,
  };
  // Sanitize request body
  req.body = new RequestBodySanitizer([
    'deliveryAddress',
    'billingAddress',
    'deliveryNote',
  ]).sanitize(req.body);

  const cart = await Cart.findOne(filter);
  let recalculate = false;
  if (req.body.currency && cart.currency !== req.body.currency) {
    recalculate = await changeCartEntriesCurrency(
      cart,
      req.body.currency,
      next,
    );
  }

  const updatedCart = await Cart.findOneAndUpdate(
    filter,
    { ...req.body, ...{ updatedAt: Date.now() } },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedCart) {
    return next(new AppError('No document found with this ID', 404));
  }

  // Recalculate cart if currency was changed
  if (recalculate) {
    updatedCart.total = await updatedCart.recalculate();
  }

  res.status(200).json({
    status: 'success',
    data: {
      document: updatedCart,
    },
  });
});

exports.deleteCart = factory.deleteOne(Cart);
