const mongoose = require('mongoose');
const GenericOrder = require('./genericOrderModel');

/**
 * CART SCHEMA
 */
const cartSchema = new mongoose.Schema(
  {},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cartSchema.virtual('valid').get(function () {
  return (
    this.deliveryAddress !== undefined &&
    this.billingAddress !== undefined &&
    this.total > 0
  );
});

const Cart = GenericOrder.discriminator('Cart', cartSchema);
module.exports = Cart;
