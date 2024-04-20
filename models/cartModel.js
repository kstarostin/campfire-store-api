const mongoose = require('mongoose');
const GenericOrder = require('./genericOrderModel');

/**
 * CART SCHEMA
 */
const cartSchema = new mongoose.Schema(
  {
    testCart: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'kind',
  },
);

const Cart = GenericOrder.discriminator('Cart', cartSchema);
module.exports = Cart;
