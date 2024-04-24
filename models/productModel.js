const mongoose = require('mongoose');
const slugifyName = require('../utils/slugifyName');
const i18nTextSchema = require('./schemes/i18nTextSchema');
const priceSchema = require('./schemes/priceSchema');
const imageContainerSchema = require('./schemes/imageContainerSchema');
const validateRefId = require('./middleware/validateRefId');
const Category = require('./categoryModel');

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
      maxlength: [
        128,
        'Product name length must be no more than 128 characters long.',
      ],
      minlength: [2, 'Product name length must at least 2 characters long.'],
    },
    descriptionI18n: i18nTextSchema({
      maxlength: [
        4096,
        'Product name length must be no more than 4096 characters long.',
      ],
    }),
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
      maxlength: [
        64,
        'Manufacturer length must be no more than 64 characters long.',
      ],
      minlength: [2, 'Manufacturer length must at least 2 characters long.'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      requred: [true, 'Product must have a category.'],
    },
    images: [imageContainerSchema],
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

productSchema
  .path('category')
  .validate(
    (value, respond) => validateRefId(value, respond, Category),
    'Invalid category ID.',
  );

// Query middleware:
productSchema.pre('find', function (next) {
  this.lean() // Convert to plain js object to exlude virtuals
    .select('-descriptionI18n')
    .populate({
      path: 'category',
      select: '_id nameI18n',
    });
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
