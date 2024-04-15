const mongoose = require('mongoose');

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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
