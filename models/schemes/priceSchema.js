const mongoose = require('mongoose');
const currencyType = require('./currencyType');

/**
 * PRICE SCHEMA
 */
const priceSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Price must have a value.'],
    min: [0.01, 'Price value must be above 0.'],
  },
  currency: currencyType,
});

module.exports = priceSchema;
