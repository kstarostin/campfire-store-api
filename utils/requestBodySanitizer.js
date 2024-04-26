class RequestBodySanitizer {
  constructor(whitelist) {
    this.whitelist =
      Array.isArray(whitelist) && whitelist.length > 0 ? whitelist : [];
  }

  /**
   * Removes all non-whitelisted properties from the object.
   * @param {*} body the object to sanitize.
   * @param {*} whitelist the array of allowed properties.
   * @returns the sanitized Object.
   */
  sanitize(body) {
    Object.keys(body)
      .filter(
        (value) => this.whitelist.length > 0 && !this.whitelist.includes(value),
      )
      .forEach((value) => {
        body[value] = undefined;
      });
    return body;
  }
}

module.exports = RequestBodySanitizer;
