const mongoose = require('mongoose');
const GenericOrderEntry = require('./genericOrderEntryModel');

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
      requred: [true, 'Order/cart must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'kind',
  },
);

// Query middleware
genericOrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  });
  next();
});

// todo: fix
// genericOrderSchema.post('findOneAndDelete', async (doc) => {
//   console.log('HERE!!');
//   await GenericOrderEntry.deleteMany({ parent: doc._id });
// });

const GenericOrder = mongoose.model('GenericOrder', genericOrderSchema);
module.exports = GenericOrder;