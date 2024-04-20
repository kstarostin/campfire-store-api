const mongoose = require('mongoose');
const GenericOrderEntry = require('./genericOrderEntryModel');

/**
 * CART ENTRY SCHEMA
 */
const cartEntrySchema = new mongoose.Schema(
  {},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'kind',
  },
);

const CartEntry = GenericOrderEntry.discriminator('CartEntry', cartEntrySchema);
module.exports = CartEntry;
