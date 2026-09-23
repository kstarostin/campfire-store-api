const mongoose = require('mongoose');
const i18nTextSchema = require('./i18nTextSchema');

/**
 * One responsive category image variant (large hero or small tile).
 */
const categoryImageSizeSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    mimeType: {
      type: String,
    },
    altTextI18n: i18nTextSchema({
      maxlength: [128, 'Image alt text length must be no more than 128 characters long.'],
    }),
  },
  { _id: false },
);

module.exports = categoryImageSizeSchema;
