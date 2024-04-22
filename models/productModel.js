const mongoose = require('mongoose');
const slugifyName = require('../utils/slugifyName');
const i18nTextSchema = require('./schemes/i18nTextSchema');
const priceSchema = require('./schemes/priceSchema');

/**
 * PRODUCT SCHEMA
 */
const productSchema = new mongoose.Schema(
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
      required: [true, 'Product must have a name.'],
      trim: true,
    },
    descriptionI18n: i18nTextSchema,
    slug: String,
    prices: {
      type: [priceSchema],
      required: true,
      validate: [
        (value) => value.length > 0,
        'Product must have at least one price.',
      ],
    },
    manufacturer: {
      type: String,
      required: [true, 'Product must have a manufacturer.'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      requred: [true, 'Product must have a category.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
productSchema.index({ slug: 1 });

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.slug = slugifyName(this.name);
  next();
});

// Query middleware:
productSchema.pre('find', function (next) {
  this.lean() // Convert to plain js object to exlude virtuals
    .select('-descriptionI18n')
    .populate({
      path: 'category',
      select: '_id nameI18n slug',
    });
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
