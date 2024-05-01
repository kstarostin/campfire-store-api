const { allowedLanguages, allowedCurrencies } = require('./config');

class DocumentSanitizer {
  constructor(sessionLanguage, sessionCurrency, maxLevel) {
    this.sessionLanguage = sessionLanguage;
    this.sessionCurrency = sessionCurrency;
    this.maxLevel = maxLevel;
  }

  /**
   * Scans through the document properties iteratively and removes text localizations and price properties,
   * which were not requested by the properties {@link sessionLanguage} and {@link sessionCurrency} accordingly.
   * The scanned levels are limited by the {@link maxLevel} property.
   *
   * @param {*} document the documenbt to scan and sanitize.
   * @returns the sanitized document.
   */
  sanitize(document) {
    // console.log('Start sanitizing document...');
    const start = Date.now();

    // Define the current object, it's path and current scan level
    let currentObject;
    let currentPath;
    if (document._doc) {
      currentObject = document._doc;
      currentPath = `document._doc`;
    } else {
      currentObject = document;
      currentPath = `document`;
    }
    const currentLevel = 1;

    // Scan regular properties on current level
    this.#scanLevel(currentObject, currentPath, currentLevel);

    // Check existence and scan virtual properties on current level
    if (document.$$populatedVirtuals) {
      currentObject = document.$$populatedVirtuals;
      currentPath = `document.$$populatedVirtuals`;

      this.#scanLevel(currentObject, currentPath, currentLevel);
    }
    // console.log(`Finish sanitizing, took ${Date.now() - start}ms`);
    return document;
  }

  /**
   * Scan and sanitize the level of properties.
   */
  #scanLevel(object, path, level) {
    if (level > this.maxLevel) {
      return;
    }
    // console.log(`Level ${level}, path: ${path}`);
    // console.log(`Keys: [${Object.keys(object).join(', ')}]`);

    // Iteraate through the level properties
    Object.keys(object).forEach((key) => {
      if (object[key] !== null && this.#isValidForSanitizing(key)) {
        // console.log(`Checking key ${path}.${key} ...`);

        // If current property is a localized text
        if (key.toLowerCase().includes('i18n')) {
          if (key.toLowerCase().includes('pricei18n')) {
            this.#sanitizeI18nPrice(object, path, key);
          } else {
            this.#sanitizeI18nText(object, path, key);
          }
        } else if (typeof object[key] === 'object') {
          // If current property is a nested object with it's own properties
          this.#scanLevel(object[key], `${path}.${key}`, level + 1);
        }
      }
    });
  }

  #isValidForSanitizing(key) {
    const excludeKeys = ['buffer'];
    return (
      !key.startsWith('$') &&
      !key.startsWith('__') &&
      !excludeKeys.includes(key)
    );
  }

  #sanitizeI18nText = (object, path, key) => {
    allowedLanguages
      .filter((lang) => lang !== this.sessionLanguage)
      .forEach((lang) => {
        // console.log(`Sanitizing i18n key: ${path}.${key}.${lang}`);
        object[key][lang] = undefined;
      });
  };

  #sanitizeI18nPrice = (object, path, key) => {
    allowedCurrencies
      .filter((currency) => currency !== this.sessionCurrency)
      .forEach((currency) => {
        // console.log(`Sanitizing i18n key: ${path}.${key}.${lang}`);
        object[key][currency] = undefined;
      });
  };
}

module.exports = DocumentSanitizer;
