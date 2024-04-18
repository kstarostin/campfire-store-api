const mongoose = require('mongoose');
const { allowedLanguages } = require('../../utils/config');

// Prepare the schema dynamically based on the app configuration of supported languages.
const schemaObject = Object.fromEntries(
  allowedLanguages.map((lang) => [lang, 'String']),
);

/**
 * LOCALIZED TEXT SCHEMA
 */
const i18nTextSchema = new mongoose.Schema(schemaObject);

module.exports = i18nTextSchema;
