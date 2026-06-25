const Badge = require('../models/badgeModel');
const Product = require('../models/productModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllBadges = factory.getAll(Badge, {
  defaultLimit: 25,
  maxLimit: 100,
});
exports.getBadge = factory.getOne(Badge);
exports.createBadge = factory.createOne(Badge, [
  'code',
  'nameI18n',
  'style',
  'active',
]);
exports.updateBadge = factory.updateOne(Badge, [
  'code',
  'nameI18n',
  'style',
  'active',
]);

exports.deleteBadge = catchAsync(async (req, res, next) => {
  const assignmentCount = await Product.countDocuments({
    'badges.badge': req.params.id,
  });

  if (assignmentCount > 0) {
    return next(
      new AppError(
        `Cannot delete badge: it is assigned to ${assignmentCount} product(s). Unassign it first.`,
        409,
      ),
    );
  }

  const document = await Badge.findByIdAndDelete(req.params.id);

  if (!document) {
    return next(new AppError('No document found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
