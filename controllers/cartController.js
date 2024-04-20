const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.assignUserToCart = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) {
    let userId;
    if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
      ({ userId } = req.params);
    } else {
      const user = await User.findOne({
        email: req.params.userId,
      });
      if (!user) {
        return next(new AppError('No user found with this ID or email', 404));
      }
      userId = user._id;
    }
    req.body.user = userId;
  }
  next();
});

exports.getAllCarts = factory.getAll(Cart, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getCart = factory.getOne(Cart);
exports.createCart = factory.createOne(Cart);
exports.updateCart = factory.updateOne(Cart);
exports.deleteCart = factory.deleteOne(Cart);
