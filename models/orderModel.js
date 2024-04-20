const mongoose = require('mongoose');
const GenericOrder = require('./genericOrderModel');

/**
 * ORDER SCHEMA
 */
const orderSchema = new mongoose.Schema(
  {
    testOrder: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'kind',
  },
);

const Order = GenericOrder.discriminator('Order', orderSchema);
module.exports = Order;
