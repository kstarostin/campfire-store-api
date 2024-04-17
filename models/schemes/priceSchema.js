const mongoose = require('mongoose');
const { allowedCurrencies } = require('../../utils/config');

/**
 * PRICE SCHEMA
 */
const priceSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Price must have a value'],
  },
  currency: {
    type: String,
    required: [true, 'Price must have a currency'],
    enum: {
      values: allowedCurrencies,
      message: `Allowed Currencies are [${allowedCurrencies.join(', ')}]`,
    },
  },
});

module.exports = priceSchema;
