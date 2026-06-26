const mongoose = require('mongoose');
const slugifyName = require('../utils/slugifyName');
const i18nTextSchema = require('./schemes/i18nTextSchema');
const i18nPriceSchema = require('./schemes/i18nPriceSchema');
const imageContainerSchema = require('./schemes/imageContainerSchema');
const productBadgeSchema = require('./schemes/productBadgeSchema');
const productHighlightSchema = require('./schemes/productHighlightSchema');
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
    priceI18n: i18nPriceSchema({
      required: [
        true,
        'Product must have a price value for each supported currency.',
      ],
    }),
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
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featureOrder: {
      type: Number,
      min: [1, 'Feature order must be at least 1.'],
    },
    badges: {
      type: [productBadgeSchema],
      default: [],
    },
    manufacturerUrl: {
      type: String,
      trim: true,
      maxlength: [
        2048,
        'Manufacturer URL must be no more than 2048 characters long.',
      ],
    },
    taglineI18n: i18nTextSchema({
      maxlength: [
        160,
        'Tagline must be no more than 160 characters long.',
      ],
    }),
    highlights: {
      type: [productHighlightSchema],
      default: [],
      validate: {
        validator(value) {
          return !value || value.length <= 4;
        },
        message: 'Product cannot have more than 4 highlights.',
      },
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
productSchema.index({ isFeatured: 1, featureOrder: 1 });
productSchema.index({ 'badges.badge': 1 });

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
productSchema.pre(/^find/, function (next) {
  this.lean() // Convert to plain js object to exlude virtuals
    .populate({
      path: 'category',
      select: '_id code nameI18n parentCategory',
    })
    .populate({
      path: 'badges.badge',
      select: '_id code nameI18n style active',
    });
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
