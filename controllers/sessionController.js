const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const {
  allowedLanguages,
  defaultLanguage,
  allowedCurrencies,
  defaultCurrency,
} = require('../utils/config');

const extractUser = async (id, next) => {
  let user;
  if (mongoose.Types.ObjectId.isValid(id)) {
    user = await User.findById(id);
  } else {
    user = await User.findOne({ email: id });
  }
  if (!user) {
    return next(new AppError('No user found with this ID or email', 404));
  }
  return user;
};

const extractCart = async (id, next) => {
  const cart = await Cart.findById(id);
  if (!cart) {
    return next(new AppError('No cart found with this ID', 404));
  }
  return cart;
};

const extractOrder = async (id, next) => {
  const order = await Order.findById(id);
  if (!order) {
    return next(new AppError('No order found with this ID', 404));
  }
  return order;
};

const validateRequestParam = (req, paramName, next) => {
  if (!req.params[paramName]) {
    return next(
      new AppError(
        `Required parameter ${paramName} for this request is missing`,
        400,
      ),
    );
  }
};

/**
 * Validates request parameter userId and populates session user in to the request.
 */
exports.handleUserId = catchAsync(async (req, res, next) => {
  validateRequestParam(req, 'userId', next);
  const user = await extractUser(req.params.userId, next);
  req.params.userId = user.id;
  req.user = user; // todo replace with authentication protection
  next();
});

/**
 * Validates request parameters userId and cartId and populates session user and cart in to the request.
 */
exports.handleUserIdCartId = catchAsync(async (req, res, next) => {
  validateRequestParam(req, 'userId', next);
  const user = await extractUser(req.params.userId, next);
  req.params.userId = user.id;
  req.user = user; // todo replace with authentication protection

  validateRequestParam(req, 'cartId', next);
  const cart = await extractCart(req.params.cartId);

  if (cart.user.id !== user.id) {
    return next(
      new AppError('No relation found between cartId and userId', 404),
    );
  }
  req.cart = cart;
  next();
});

/**
 * Validates request parameters userId and orderId and populates session user in to the request.
 */
exports.handleUserIdOrderId = catchAsync(async (req, res, next) => {
  validateRequestParam(req, 'userId', next);
  const user = await extractUser(req.params.userId, next);
  req.params.userId = user.id;
  req.user = user; // todo replace with authentication protection

  validateRequestParam(req, 'orderId', next);
  const order = await extractOrder(req.params.cartId);

  if (order.user.id !== user.id) {
    return next(
      new AppError('No relation found between orderId and userId', 404),
    );
  }
  next();
});

/**
 * Sets the request language value either from the query parameter (if provided), or ftom the default value.
 */
exports.handleLanguage = (req, res, next) => {
  const queryLanguage = req.query.language;
  req.language =
    queryLanguage && allowedLanguages.includes(queryLanguage)
      ? queryLanguage
      : defaultLanguage;
  // console.log(`Session language: ${req.language}`);
  next();
};

/**
 * Sets the request currency value either from the query parameter (if provided), or ftom the default value.
 */
exports.handleCurrency = (req, res, next) => {
  const queryCurrency = req.query.currency;
  req.currency =
    queryCurrency && allowedCurrencies.includes(queryCurrency)
      ? queryCurrency
      : defaultCurrency;
  // console.log(`Session currency: ${req.currency}`);
  next();
};
