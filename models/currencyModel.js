const mongoose = require('mongoose');
const i18nTextSchema = require('./schemes/i18nTextSchema');

/**
 * CURRENCY SCHEMA
 */
const currencySchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: [true, 'Currency must have a unique code.'],
    unique: true,
    maxlength: [
      3,
      'Currency code length must be no more than 3 characters long.',
    ],
    minlength: [3, 'Currency code length must at least 3 characters long.'],
  },
  nameI18n: {
    type: i18nTextSchema(),
    required: [true, 'Currency must have a name.'],
  },
});

const Currency = mongoose.model('Currency', currencySchema);
module.exports = Currency;
