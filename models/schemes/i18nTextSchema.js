const mongoose = require('mongoose');
const { allowedLanguages } = require('../../utils/config');

/**
 * LOCALIZED TEXT VALUE SCHEMA
 */
const i18nValueSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: [true, 'Localized text must have a language specified'],
    enum: {
      values: allowedLanguages,
      message: `Allowed text languages are [${allowedLanguages.join(', ')}]`,
    },
  },
  value: {
    type: String,
    required: [true, 'Localized text must have a value specified'],
  },
});

/**
 * LOCALIZED TEXT SCHEMA
 */
const i18nTextSchema = new mongoose.Schema({
  values: {
    type: [i18nValueSchema],
    validate: [
      (el) => Array.isArray(el) && el.length > 0,
      'Please add at least one localized value',
    ],
  },
});

module.exports = i18nTextSchema;
