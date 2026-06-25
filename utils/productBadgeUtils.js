const mongoose = require('mongoose');
const AppError = require('./appError');
const Badge = require('../models/badgeModel');

const stripActiveFromBadge = (badge) => {
  if (!badge || typeof badge !== 'object') {
    return badge;
  }

  const { active, ...badgeWithoutActive } = badge;
  return badgeWithoutActive;
};

/**
 * Remove inactive or missing badge refs and sort assignments by priority.
 */
exports.normalizeProductBadges = (product) => {
  if (!product || !Array.isArray(product.badges)) {
    return product;
  }

  product.badges = product.badges
    .filter((assignment) => {
      if (!assignment?.badge) {
        return false;
      }

      return assignment.badge.active !== false;
    })
    .sort((left, right) => left.priority - right.priority)
    .map((assignment) => ({
      priority: assignment.priority,
      badge: stripActiveFromBadge(assignment.badge),
    }));

  return product;
};

exports.validateProductBadgeAssignments = async (badges) => {
  if (badges === undefined) {
    return;
  }

  if (!Array.isArray(badges)) {
    throw new AppError('Product badges must be an array.', 400);
  }

  if (badges.length === 0) {
    return;
  }

  const badgeIds = badges.map((assignment) => {
    if (!assignment?.badge || !mongoose.Types.ObjectId.isValid(assignment.badge)) {
      throw new AppError('Each badge assignment must include a valid badge ID.', 400);
    }

    if (
      typeof assignment.priority !== 'number' ||
      !Number.isInteger(assignment.priority) ||
      assignment.priority < 1
    ) {
      throw new AppError('Each badge assignment must have priority >= 1.', 400);
    }

    return assignment.badge.toString();
  });

  if (new Set(badgeIds).size !== badgeIds.length) {
    throw new AppError('Product cannot assign the same badge more than once.', 400);
  }

  const activeBadgeCount = await Badge.countDocuments({
    _id: { $in: badgeIds },
    active: true,
  });

  if (activeBadgeCount !== badgeIds.length) {
    throw new AppError(
      'One or more badges are invalid, inactive, or do not exist.',
      400,
    );
  }
};
