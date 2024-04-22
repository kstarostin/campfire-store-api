const mongoose = require('mongoose');
const GenericOrderEntry = require('./genericOrderEntryModel');
const validateRefId = require('./middleware/validateRefId');
const User = require('./userModel');

/**
 * GENERIC ORDER SCHEMA
 */
const genericOrderSchema = new mongoose.Schema(
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
      requred: [true, 'Order/cart must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'kind',
  },
);

genericOrderSchema.virtual('entries', {
  ref: 'GenericOrderEntry',
  foreignField: 'parent',
  localField: '_id',
  justOne: false,
});

// Document middleware
genericOrderSchema
  .path('user')
  .validate(
    (value, respond) => validateRefId(value, respond, User),
    'Invalid user ID.',
  );

// Query middleware
genericOrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '_id name email',
  }).populate({
    path: 'entries',
    select: '_id product quantity',
  });
  next();
});

genericOrderSchema.pre('findOneAndDelete', async function (next) {
  if (this?.getFilter()?._id) {
    const cartId = this.getFilter()._id;
    await GenericOrderEntry.deleteMany({ parent: cartId });
  }
  next();
});

const GenericOrder = mongoose.model('GenericOrder', genericOrderSchema);
module.exports = GenericOrder;
