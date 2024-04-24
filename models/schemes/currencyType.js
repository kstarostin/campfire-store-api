const { allowedCurrencies } = require('../../utils/config');

/**
 * CURRENCY TYPE
 */
const currencyType = {
  type: String,
  required: [true, 'Price must have a currency.'],
  enum: {
    values: allowedCurrencies,
    message: `Allowed currencies are [${allowedCurrencies.join(', ')}].`,
  },
};

module.exports = currencyType;
