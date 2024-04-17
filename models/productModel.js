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
    .select('-description')
    .populate({
      path: 'category',
      select: '_id name slug',
    });
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
