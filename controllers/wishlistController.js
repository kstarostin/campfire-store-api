const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Wishlist = require('../models/wishlistModel');
const WishlistEntry = require('../models/wishlistEntryModel');
const factory = require('./controllerFactory');
const RequestBodySanitizer = require('../utils/requestBodySanitizer');

/**
 * Check that user has no existing wishlists.
 */
exports.oneWishlistPerUser = catchAsync(async (req, res, next) => {
  if (!req.params.userId) {
    return next();
  }
  if ((await Wishlist.countDocuments({ user: req.params.userId })) > 0) {
    return next(
      new AppError(
        `The user with ID ${req.params.userId} already has a wishlist. One wishlist is allowed per user.`,
        400,
      ),
    );
  }
  next();
});

exports.assignUserToWishlist = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.params.userId;
  }
  next();
};

exports.getAllWishlists = factory.getAll(Wishlist, {
  defaultLimit: 1,
  maxLimit: 10,
});
exports.getWishlist = factory.getOne(Wishlist);

exports.createWishlist = catchAsync(async (req, res, next) => {
  req.body = new RequestBodySanitizer(['name']).sanitize(req.body);
  const newDocument = await Wishlist.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      document: newDocument,
    },
  });
});

exports.updateWishlist = catchAsync(async (req, res, next) => {
  const filter = {
    user: req.params.userId,
    _id: req.params.wishlistId,
  };
  req.body = new RequestBodySanitizer(['name']).sanitize(req.body);

  const updatedWishlist = await Wishlist.findOneAndUpdate(
    filter,
    { ...req.body, updatedAt: Date.now() },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedWishlist) {
    return next(new AppError('No document found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      document: updatedWishlist,
    },
  });
});

exports.deleteWishlist = catchAsync(async (req, res, next) => {
  const filter = {
    user: req.params.userId,
    _id: req.params.wishlistId,
  };

  const wishlist = await Wishlist.findOne(filter);
  if (!wishlist) {
    return next(new AppError('No document found with this ID', 404));
  }

  await WishlistEntry.deleteMany({ parent: wishlist.id });
  await Wishlist.findOneAndDelete(filter);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
