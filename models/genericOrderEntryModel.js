const mongoose = require('mongoose');
const validateRefId = require('./middleware/validateRefId');
const Product = require('./productModel');

/**
 * CART/ORDER ENTRY SCHEMA
 */
const entrySchema = new mongoose.Schema(
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
      requred: [true, 'Entry must have a product.'],
    },
    quantity: {
      type: Number,
      default: 1,
      required: [true, 'Entry must have a quantity.'],
      min: [1, 'Entry quantity value must be above 0'],
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: 'GenericOrder',
      requred: [true, 'Entry must belong to an order or to a cart.'],
    },
    price: {
      type: Number,
      required: [true, 'Entry must have a price.'],
      min: [0.01, 'Price value must be above 0.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Document middleware
entrySchema
  .path('product')
  .validate(
    (value, respond) => validateRefId(value, respond, Product),
    'Invalid product ID.',
  );

// Query middleware:
// TODO: fix TypeError: Cannot read properties of undefined (reading 'wasPopulated')
// entrySchema.pre('find', function (next) {
//   this.populate({
//     path: 'product',
//     select: '-descriptionI18n',
//   });
//   next();
// });

const GenericOrderEntry = mongoose.model('GenericOrderEntry', entrySchema);
module.exports = GenericOrderEntry;
