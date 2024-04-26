const mongoose = require('mongoose');
const i18nTextSchema = require('./schemes/i18nTextSchema');

/**
 * TITLE SCHEMA
 */
const titleSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  code: {
    type: String,
    required: [true, 'Title must have a unique code.'],
    unique: true,
    maxlength: [
      16,
      'Title code length must be no more than 16 characters long.',
    ],
    minlength: [2, 'Title code length must at least 2 characters long.'],
  },
  nameI18n: {
    type: i18nTextSchema({
      maxlength: [
        8,
        'Title name length must be no more than 8 characters long.',
      ],
    }),
    required: [true, 'Title must have a name.'],
  },
});

const Title = mongoose.model('Title', titleSchema);
module.exports = Title;
