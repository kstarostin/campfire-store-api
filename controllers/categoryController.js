const Category = require('../models/categoryModel');
const factory = require('./controllerFactory');

exports.getAllCategories = factory.getAll(Category, {
  defaultLimit: 25,
  maxLimit: 100,
});
exports.getCategory = factory.getOne(Category, [
  { path: 'subCategories' },
  { path: 'parentCategory' },
]);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
