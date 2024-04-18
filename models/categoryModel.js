const mongoose = require('mongoose');
const i18nTextSchema = require('./schemes/i18nTextSchema');
const slugifyName = require('../utils/slugifyName');

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
      required: [true, 'Category must have a unique code'],
      unique: true,
      trim: true,
    },
    nameI18n: {
      type: i18nTextSchema,
      required: [true, 'Category must have a name'],
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
module.exports = Category;
