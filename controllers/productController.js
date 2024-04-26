const Product = require('../models/productModel');
const factory = require('./controllerFactory');

exports.getAllProducts = factory.getAll(Product, {
  defaultLimit: 25,
  maxLimit: 50,
});
exports.getProduct = factory.getOne(Product, [{ path: 'category' }]);
exports.createProduct = factory.createOne(Product, [
  'name',
  'descriptionI18n',
  'prices',
  'manufacturer',
  'category',
]);
exports.updateProduct = factory.updateOne(Product, [
  'name',
  'descriptionI18n',
  'prices',
  'manufacturer',
  'category',
]);
exports.deleteProduct = factory.deleteOne(Product);
