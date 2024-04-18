const Category = require('../models/categoryModel');
const factory = require('./controllerFactory');

exports.getAllCategories = factory.getAll(
  Category,
  {
    defaultLimit: 25,
    maxLimit: 100,
  },
  ['nameI18n'],
);
exports.getCategory = factory.getOne(
  Category,
  [{ path: 'subCategories' }, { path: 'parentCategory' }],
  ['nameI18n'],
);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
