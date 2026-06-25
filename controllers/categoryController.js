const Category = require('../models/categoryModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

exports.getAllCategories = factory.getAll(Category, {
  defaultLimit: 25,
  maxLimit: 100,
});
exports.getCategory = factory.getOne(Category, [
  { path: 'subCategories' },
  { path: 'parentCategory' },
]);
exports.createCategory = factory.createOne(Category, [
  'code',
  'nameI18n',
  'parentCategory',
  'icon',
]);
exports.updateCategory = factory.updateOne(Category, [
  'code',
  'nameI18n',
  'parentCategory',
  'icon',
]);
exports.deleteCategory = factory.deleteOne(Category);

/**
 * Resolve :id path param as a MongoDB id or a unique category code.
 * Normalizes req.params.id to the document id for downstream handlers.
 */
exports.resolveCategoryParam = catchAsync(async (req, res, next) => {
  const param = req.params.id;
  let category;

  if (mongoose.Types.ObjectId.isValid(param)) {
    category = await Category.findById(param);
  }

  if (!category) {
    category = await Category.findOne({ code: param });
  }

  if (!category) {
    return next(new AppError('No category found with this ID.', 404));
  }

  req.params.id = category.id;
  next();
});
