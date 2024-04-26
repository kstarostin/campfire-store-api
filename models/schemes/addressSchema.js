const mongoose = require('mongoose');
const validator = require('validator');

/**
 * ADDRESS SCHEMA
 */
const addressSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.ObjectId,
    ref: 'Title',
  },
  name: {
    type: String,
    required: [true, 'Address must have a name'],
    maxlength: [128, 'Name length must be no more than 64 characters long.'],
    minlength: [2, 'Name length must at least 2 characters long.'],
  },
  phone: String,
  street: {
    type: String,
    required: [true, 'Address must have a street'],
    maxlength: [
      128,
      'Street name length must be no more than 128 characters long.',
    ],
    minlength: [2, 'Street name length must be at least 2 characters long.'],
  },
  house: {
    type: String,
    maxlength: [16, 'House number must be no more than 16 characters long.'],
  },
  postalCode: {
    type: String,
    required: [true, 'Address must have a postal code'],
    maxlength: [
      6,
      'Postal code length must be no more than 6 characters long.',
    ],
    minlength: [4, 'Postal code length must be at least 2 characters long.'],
    validate: [
      validator.isNumeric,
      'Please provide a valid numeric postal code.',
    ],
  },
  town: {
    type: String,
    required: [true, 'Address must have a town'],
    maxlength: [
      32,
      'Town name length must be no more than 32 characters long.',
    ],
    minlength: [2, 'Town name length must be at least 2 characters long.'],
  },
  country: {
    type: String,
    required: [true, 'Address must have a cauntry'],
    maxlength: [
      32,
      'Country name length must be no more than 32 characters long.',
    ],
    minlength: [2, 'Country name length must be at least 2 characters long.'],
  },
});

module.exports = addressSchema;
