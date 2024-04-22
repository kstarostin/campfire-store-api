const mongoose = require('mongoose');
const { allowedLanguages } = require('../../utils/config');

// Prepare the schema dynamically based on the app configuration of supported languages.
const createSchemaObject = function (options = {}) {
  return Object.fromEntries(
    allowedLanguages.map((lang) => {
      const langOptions = {
        type: 'String',
      };
      return [lang, { ...langOptions, ...options }];
    }),
  );
};

/**
 * LOCALIZED TEXT SCHEMA
 */
// const i18nTextSchema = new mongoose.Schema(createSchemaObject());

const i18nTextSchema = function (options) {
  return new mongoose.Schema(createSchemaObject(options));
};

module.exports = i18nTextSchema;
