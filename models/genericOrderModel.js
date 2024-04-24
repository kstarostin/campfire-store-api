const mongoose = require('mongoose');
const GenericOrderEntry = require('./genericOrderEntryModel');
const validateRefId = require('./middleware/validateRefId');
const User = require('./userModel');
const currencyType = require('./schemes/currencyType');
const addressSchema = require('./schemes/addressSchema');

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
    currency: currencyType,
    total: {
      type: Number,
      default: 0,
    },
    deliveryAddress: addressSchema,
    billingAddress: addressSchema,
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
    select: '_id product quantity price',
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

genericOrderSchema.methods.recalculate = async function () {
  let total = 0;

  const entries = await GenericOrderEntry.find({ parent: this._id });
  entries?.forEach((entry) => {
    total += entry.price;
  });
  this.total = total;

  await this.save();
};

module.exports = GenericOrder;
