const Product = require('../models/productModel');
const factory = require('./controllerFactory');

exports.getAllProducts = factory.getAll(Product, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getProduct = factory.getOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
