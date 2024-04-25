const User = require('../models/userModel');
const factory = require('./controllerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = factory.getAll(User, {
  defaultLimit: 25,
  maxLimit: 100,
});
exports.createUser = factory.createOne(User);

// Checks if the ID matches the MongoDB ID format to avoud casting errors.
const isValidId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

/**
 * Function to get an exact user by requested ID or email.
 * @returns a successful response with the found user, if such exists, or an error response.
 */
exports.getUser = catchAsync(async (req, res, next) => {
  const user = isValidId(req.params.userId)
    ? await User.findById({ _id: req.params.userId })
    : await User.findOne({
        email: req.params.userId,
      });
  if (!user) {
    return next(new AppError('No user found with this ID or email', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      document: user,
    },
  });
});

/**
 * Function to update an exact user by requested ID or email.
 * @returns a successful response with the found user, if such exists, or an error response.
 */
exports.updateUser = catchAsync(async (req, res, next) => {
  // Search for a user by ID or email
  const user = isValidId(req.params.userId)
    ? await User.findById(req.params.userId)
    : await User.findOne({ email: req.params.userId });
  // Check existence
  if (!user) {
    return next(new AppError('No user found with this ID or email', 404));
  }
  // Make sure non-admins can't manage their roles
  if (!req.user?.roles?.includes('admin')) {
    req.body.roles = undefined;
  }
  // Forbid changing passwords on this route
  if (req.body.password) {
    return next(
      new AppError('This route does not allow changing passwords.', 400),
    );
  }
  // Perform update
  const updatedUser = await User.findByIdAndUpdate(
    user.id,
    { ...req.body, ...{ updatedAt: Date.now() } },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      document: updatedUser,
    },
  });
});

/**
 * Function to delete an exact user by requested ID or email.
 * @returns a successful response, if the user was found and deleted, or an error response.
 */
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = isValidId(req.params.userId)
    ? await User.findByIdAndDelete(req.params.userId)
    : await User.findOneAndDelete({ email: req.params.userId });
  if (!user) {
    return next(new AppError('No user found with this ID or email', 404));
  }
  res.status(204).json({
    status: 'success',
    data: {
      document: null,
    },
  });
});
