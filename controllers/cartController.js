const Cart = require('../models/cartModel');
const factory = require('./controllerFactory');

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
