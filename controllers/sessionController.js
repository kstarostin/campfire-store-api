const {
  allowedLanguages,
  defaultLanguage,
  allowedCurrencies,
  defaultCurrency,
} = require('../utils/config');

/**
 * Sets the request language value either from the query parameter (if provided), or ftom the default value.
 */
exports.parseLanguage = (req, res, next) => {
  const queryLanguage = req.query.language;
  req.language =
    queryLanguage && allowedLanguages.includes(queryLanguage)
      ? queryLanguage
      : defaultLanguage;
  console.log(`Session language: ${req.language}`);
  next();
};

/**
 * Sets the request currency value either from the query parameter (if provided), or ftom the default value.
 */
exports.parseCurrency = (req, res, next) => {
  const queryCurrency = req.query.currency;
  req.currency =
    queryCurrency && allowedCurrencies.includes(queryCurrency)
      ? queryCurrency
      : defaultCurrency;
  console.log(`Session currency: ${req.currency}`);
  next();
};
