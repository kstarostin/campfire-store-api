const mongoose = require('mongoose');
const categoryImageSizeSchema = require('./categoryImageSizeSchema');

/**
 * Category imagery — large (1920×1080 hero) and small (800×600 tile).
 */
const categoryImageSchema = new mongoose.Schema(
  {
    large: categoryImageSizeSchema,
    small: categoryImageSizeSchema,
  },
  { _id: false },
);

module.exports = categoryImageSchema;
