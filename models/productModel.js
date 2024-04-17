const mongoose = require('mongoose');
const slugifyName = require('../utils/slugifyName');

/**
 * Describes the complete schema of the product model type.
 */
const productSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Product must have a name'],
      trim: true,
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'Product must have a price'],
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
