const mongoose = require('mongoose');
const GenericOrder = require('./genericOrderModel');
const { allowedOrderStatuses, defaultOrderStatus } = require('../utils/config');

/**
 * ORDER SCHEMA
 */
const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, 'An order must have a status'],
      default: defaultOrderStatus,
      enum: {
        values: allowedOrderStatuses,
        message: `Allowed order statuses are [${allowedOrderStatuses.join(', ')}]`,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Order = GenericOrder.discriminator('Order', orderSchema);
module.exports = Order;
