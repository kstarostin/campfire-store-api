/**
 * Minimal replacement for the abandoned `express-mongo-sanitize` package
 * (last published 2022), which is incompatible with Express 5 because it
 * assigns to `req.query` — a getter-only property since Express 5.
 *
 * Semantics are deliberately identical to that package:
 *   - only object KEYS are inspected, never string values, so legitimate
 *     payloads such as ?filter={"priceI18n.USD":{"$lt":100}} or a search for
 *     "kayak $100" pass through untouched;
 *   - a key starting with "$" or containing "." is removed outright;
 *   - objects and arrays are walked recursively.
 *
 * The published forks of express-mongo-sanitize sanitize values as well as
 * keys, which silently corrupts this API's JSON `filter` parameter and any
 * user-supplied text containing "$".
 */

const TEST_REGEX = /^\$|\./;

const sanitizeInPlace = (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    value.forEach(sanitizeInPlace);
    return value;
  }

  Object.keys(value).forEach((key) => {
    if (TEST_REGEX.test(key)) {
      delete value[key];
      return;
    }
    sanitizeInPlace(value[key]);
  });

  return value;
};

/**
 * Express middleware removing MongoDB operator keys from the request.
 * @returns the middleware function.
 */
module.exports = () => (req, res, next) => {
  ['body', 'params', 'headers'].forEach((key) => {
    if (req[key]) {
      sanitizeInPlace(req[key]);
    }
  });

  // req.query is a lazily-evaluated getter in Express 5, so redefine it rather
  // than assign to it. `configurable: true` keeps it redefinable by later
  // middleware (express-xss-sanitizer does the same thing).
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: sanitizeInPlace({ ...req.query }),
      writable: false,
      configurable: true,
      enumerable: true,
    });
  }

  next();
};

module.exports.sanitizeInPlace = sanitizeInPlace;
