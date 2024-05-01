const mongoose = require('mongoose');
const { allowedCurrencies } = require('../../utils/config');

// Prepare the schema dynamically based on the app configuration of supported currencies.
const createSchemaObject = function (options = {}) {
  return Object.fromEntries(
    allowedCurrencies.map((currency) => {
      const currencyOptions = {
        type: 'Number',
      };
      return [currency, { ...currencyOptions, ...options }];
    }),
  );
};

/**
 * INTERNATIONALIZED PRICE SCHEMA
 */
const i18nPriceSchema = function (options) {
  return new mongoose.Schema(createSchemaObject(options));
};

module.exports = i18nPriceSchema;
