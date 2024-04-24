const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Cart = require('../models/cartModel');
const factory = require('./controllerFactory');

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
exports.createCart = factory.createOne(Cart);
exports.updateCart = factory.updateOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);
