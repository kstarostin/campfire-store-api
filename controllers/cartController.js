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
      data: newDocument,
    },
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  // Cart currency can't be changed
  req.body.currency = undefined;
  // To allow for nested GET objects on user
  const filter = {
    user: req.params.userId,
    _id: req.params.cartId,
  };

  const document = await Cart.findOneAndUpdate(
    filter,
    { ...req.body, ...{ updatedAt: Date.now() } },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!document) {
    return next(new AppError('No document found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: document,
    },
  });
});

exports.deleteCart = factory.deleteOne(Cart);
