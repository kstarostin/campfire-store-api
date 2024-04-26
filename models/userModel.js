const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const imageContainerSchema = require('./schemes/imageContainerSchema');
const addressSchema = require('./schemes/addressSchema');
const { allowedUserRoles, defaultUserRole } = require('../utils/config');

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
      maxlength: [
        128,
        'User name length must be no more than 128 characters long.',
      ],
      minlength: [2, 'User name length must at least 2 characters long.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email.'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email.'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minLength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    roles: {
      type: [
        {
          type: String,
          enum: {
            values: allowedUserRoles,
            message: `Allowed roles are [${allowedUserRoles.join(', ')}].`,
          },
          default: defaultUserRole,
        },
      ],
      required: true,
      validate: [
        (value) => value.length > 0,
        'User must have at least one role.',
      ],
    },
    photo: imageContainerSchema,
    deliveryAddresses: [addressSchema],
    billingAddresses: [addressSchema],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
userSchema.index({ email: 1 });

// Document middleware
userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) {
    return next();
  }
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Query middleware
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'deliveryAddresses',
    populate: {
      path: 'title',
      select: '_id code nameI18n',
    },
  }).populate({
    path: 'billingAddresses',
    populate: {
      path: 'title',
      select: '_id code nameI18n',
    },
  });
  next();
});

userSchema.methods.validatePassword = async function (
  passwordToCheck,
  userPassword,
) {
  return await bcrypt.compare(passwordToCheck, userPassword);
};

userSchema.methods.passwordChangedAfter = async function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return jwtTimestamp < changedTimestamp;
  }
  // false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
