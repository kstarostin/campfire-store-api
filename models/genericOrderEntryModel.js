const mongoose = require('mongoose');

/**
 * GENERIC ORDER ENTRY SCHEMA
 */
const genericOrderEntrySchema = new mongoose.Schema(
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
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      requred: [true, 'Entry must have a product'],
    },
    quantity: {
      type: Number,
      default: 1,
      required: [true, 'Entry must have a quantity'],
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: 'GenericOrder',
      requred: [true, 'Entry must belong to an order or a cart'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'kind',
  },
);

const GenericOrderEntry = mongoose.model(
  'GenericOrderEntry',
  genericOrderEntrySchema,
);
module.exports = GenericOrderEntry;
