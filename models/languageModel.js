const mongoose = require('mongoose');
const i18nTextSchema = require('./schemes/i18nTextSchema');

/**
 * LANGUAGE SCHEMA
 */
const languageSchema = new mongoose.Schema({
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
    required: [true, 'Language must have a unique code.'],
    unique: true,
    maxlength: [
      2,
      'Language code length must be no more than 2 characters long.',
    ],
    minlength: [2, 'Language code length must at least 2 characters long.'],
  },
  nameI18n: {
    type: i18nTextSchema(),
    required: [true, 'Language must have a name.'],
  },
});

const Language = mongoose.model('Language', languageSchema);
module.exports = Language;
