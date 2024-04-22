const mongoose = require('mongoose');
const validator = require('validator');
const imageContainerSchema = require('./schemes/imageContainerSchema');

/**
 * USER SCHEMA
 */
const userSchema = new mongoose.Schema(
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
      required: [true, 'User must have a name.'],
      trim: true,
      maxlength: [128, 'User name length must be 64 characters maximum.'],
      minlength: [2, 'User name length must be 2 characters minimum.'],
    },
    email: {
      type: String,
      required: [true, 'User must have an email.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    photo: imageContainerSchema,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
