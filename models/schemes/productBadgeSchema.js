const mongoose = require('mongoose');
const validateRefId = require('../middleware/validateRefId');
const Badge = require('../badgeModel');

/**
 * PRODUCT BADGE ASSIGNMENT SCHEMA
 */
const productBadgeSchema = new mongoose.Schema({
  badge: {
    type: mongoose.Schema.ObjectId,
    ref: 'Badge',
    required: [true, 'Product badge assignment must reference a badge.'],
  },
  priority: {
    type: Number,
    required: [true, 'Product badge assignment must have a priority.'],
    min: [1, 'Badge priority must be at least 1.'],
  },
});

productBadgeSchema
  .path('badge')
  .validate(
    (value, respond) => validateRefId(value, respond, Badge),
    'Invalid badge ID.',
  );

module.exports = productBadgeSchema;
