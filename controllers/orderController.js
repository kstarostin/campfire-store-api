const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./controllerFactory');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const { defaultOrderStatus } = require('../utils/config');

exports.getAllOrders = factory.getAll(Order, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getOrder = factory.getOne(Order);

exports.placeOrder = catchAsync(async (req, res, next) => {
  // Request validation
  if (!req.body.cartId) {
    return next(new AppError('No document found with this ID', 404));
  }
  let cart = await Cart.findById(req.body.cartId);
  if (cart.user.id !== req.user.id) {
    return next(
      new AppError(
        'The cart with requested ID does not belong to this user',
        404,
      ),
    );
  }

  cart = await Cart.findByIdAndUpdate(
    cart._id,
    { kind: 'Order', status: defaultOrderStatus },
    { runValidators: true, overwriteDiscriminatorKey: true, new: true },
  );
  const newOrder = await Order.findById(cart._id);

  res.status(201).json({
    status: 'success',
    data: {
      data: newOrder,
    },
  });
});
