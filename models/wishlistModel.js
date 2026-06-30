const mongoose = require('mongoose');
const validateRefId = require('./middleware/validateRefId');
const User = require('./userModel');

/**
 * WISHLIST SCHEMA
 */
const wishlistSchema = new mongoose.Schema(
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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Wishlist must belong to a user.'],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [64, 'Wishlist name must be at most 64 characters.'],
      default: 'Wishlist',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

wishlistSchema
  .path('user')
  .validate(
    (value, respond) => validateRefId(value, respond, User),
    'Invalid user ID.',
  );

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
