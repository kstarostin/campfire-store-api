const mongoose = require('mongoose');
const validateRefId = require('./middleware/validateRefId');
const Product = require('./productModel');
const Wishlist = require('./wishlistModel');

/**
 * WISHLIST ENTRY SCHEMA
 */
const wishlistEntrySchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Entry must have a product.'],
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: 'Wishlist',
      required: [true, 'Entry must belong to a wishlist.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

wishlistEntrySchema.index({ parent: 1, product: 1 }, { unique: true });

wishlistEntrySchema
  .path('product')
  .validate(
    (value, respond) => validateRefId(value, respond, Product),
    'Invalid product ID.',
  );

wishlistEntrySchema
  .path('parent')
  .validate(
    (value, respond) => validateRefId(value, respond, Wishlist),
    'Invalid wishlist ID.',
  );

const WishlistEntry = mongoose.model('WishlistEntry', wishlistEntrySchema);
module.exports = WishlistEntry;
