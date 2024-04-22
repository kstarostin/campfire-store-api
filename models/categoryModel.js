const mongoose = require('mongoose');
const i18nTextSchema = require('./schemes/i18nTextSchema');
const validateRefId = require('./middleware/validateRefId');

/**
 * CATEGORY SCHEMA
 */
const categorySchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    code: {
      type: String,
      required: [true, 'Category must have a unique code.'],
      unique: true,
      maxlength: [32, 'Category code length must be 32 characters maximum.'],
      minlength: [2, 'Product code length must be 2 characters minimum.'],
    },
    nameI18n: {
      type: i18nTextSchema({
        maxlength: [64, 'Category name length must be 64 characters maximum.'],
      }),
      required: [true, 'Category must have a name.'],
    },
    parentCategory: { type: mongoose.Schema.ObjectId, ref: 'Category' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual('subCategories', {
  ref: 'Category',
  foreignField: 'parentCategory',
  localField: '_id',
});

categorySchema.virtual('root').get(function () {
  return !this.parentCategory;
});

const Category = mongoose.model('Category', categorySchema);

// Document middleware
categorySchema
  .path('parentCategory')
  .validate(
    (value, respond) => validateRefId(value, respond, Category),
    'Invalid parent category ID.',
  );

module.exports = Category;
