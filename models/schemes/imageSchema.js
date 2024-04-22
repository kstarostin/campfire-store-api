const mongoose = require('mongoose');
const { allowedImageMimeTypes } = require('../../utils/config');

/**
 * IMAGE SCHEMA
 */
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image must have a URL.'],
  },
  altText: {
    type: String,
    maxlength: [
      128,
      'Image alt text length must be no more than 128 characters long.',
    ],
  },
  mimeType: {
    type: String,
    required: [true, 'Image must have a mime type.'],
    enum: {
      values: allowedImageMimeTypes,
      message: `Allowed mime types are [${allowedImageMimeTypes.join(', ')}].`,
    },
  },
});

module.exports = imageSchema;
