/**
 * Adds an automatic catch block to an asynchronous function.
 * @param {*} fn the function to add the catch block.
 * @returns the transformed function.
 */
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};
