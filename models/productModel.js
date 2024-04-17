const mongoose = require('mongoose');
const slugifyName = require('../utils/slugifyName');
const { allowedCurrencies, allowedLanguages } = require('../utils/config');

/**
 * PRICE SCHEMA
 */
const priceSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Price must have a value'],
  },
  currency: {
    type: String,
    required: [true, 'Price must have a currency'],
    enum: {
      values: allowedCurrencies,
      message: `Allowed Currencies are [${allowedCurrencies.join(', ')}]`,
    },
  },
});

/**
 * LOCALIZED TEXT VALUE SCHEMA
 */
const i18nValueSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: [true, 'Localized text must have a language specified'],
    enum: {
      values: allowedLanguages,
      message: `Allowed text languages are [${allowedLanguages.join(', ')}]`,
    },
  },
  value: {
    type: String,
    required: [true, 'Localized text must have a value specified'],
  },
});

/**
 * LOCALIZED TEXT SCHEMA
 */
const i18nTextSchema = new mongoose.Schema({
  values: {
    type: [i18nValueSchema],
    validate: [
      (el) => Array.isArray(el) && el.length > 0,
      'Please add at least one localized value',
    ],
  },
});

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
      required: [true, 'Product must have a name'],
      trim: true,
    },
    description: i18nTextSchema,
    slug: String,
    price: {
      type: priceSchema,
      required: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Product must have a manufacturer'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      requred: [true, 'Product must have a category'],
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
    .populate({
      path: 'category',
      select: '_id name slug',
    });
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
