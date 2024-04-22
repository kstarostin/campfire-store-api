const mongoose = require('mongoose');
const imageSchema = require('./imageSchema');

/**
 * IMAGE CONTAINER SCHEMA
 */
const imageContainerSchema = new mongoose.Schema({
  original: imageSchema,
  large: imageSchema, // 2000x2000
  medium: imageSchema, // 1000x1000
  small: {
    type: imageSchema, // 500x500
    required: [
      true,
      'Image must have a small version. Recommended dimensions are 500 x 500.',
    ],
  },
  thumbnail: {
    type: imageSchema, // 200x200
    required: [
      true,
      'Image must have a thumbnail version. Recommended dimensions are 200 x 200.',
    ],
  },
});

module.exports = imageContainerSchema;
