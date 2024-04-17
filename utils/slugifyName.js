const slugify = require('slugify');

module.exports = (text) =>
  slugify(text, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
