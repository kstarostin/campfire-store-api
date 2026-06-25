const mongoose = require('mongoose');
const i18nTextSchema = require('./schemes/i18nTextSchema');
const { allowedBadgeStyles, defaultBadgeStyle } = require('../utils/config');

/**
 * BADGE SCHEMA
 */
const badgeSchema = new mongoose.Schema({
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
    required: [true, 'Badge must have a unique code.'],
    unique: true,
    maxlength: [
      16,
      'Badge code length must be no more than 16 characters long.',
    ],
    minlength: [2, 'Badge code length must at least 2 characters long.'],
  },
  nameI18n: {
    type: i18nTextSchema({
      maxlength: [
        24,
        'Badge name length must be no more than 24 characters long.',
      ],
    }),
    required: [true, 'Badge must have a name.'],
  },
  style: {
    type: String,
    enum: {
      values: allowedBadgeStyles,
      message: `Allowed badge styles are [${allowedBadgeStyles.join(', ')}].`,
    },
    default: defaultBadgeStyle,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

badgeSchema.index({ active: 1 });

const Badge = mongoose.model('Badge', badgeSchema);
module.exports = Badge;
