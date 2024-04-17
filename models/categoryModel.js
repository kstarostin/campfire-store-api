const mongoose = require('mongoose');
const slugifyName = require('../utils/slugifyName');

/**
 * Describes the complete schema of the product model type.
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
    name: {
      type: String,
      required: [true, 'Category must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
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

// Document middleware: runs before .save() and .create()
categorySchema.pre('save', function (next) {
  this.slug = slugifyName(this.name);
  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
