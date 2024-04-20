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
  const user = isValidId(req.params.id)
    ? await User.findById({ _id: req.params.id })
    : await User.findOne({
        email: req.params.id,
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
  const updatedUser = isValidId(req.params.id)
    ? await User.findByIdAndUpdate(
        req.params.id,
        { ...req.body, ...{ updatedAt: Date.now() } },
        {
          new: true,
          runValidators: true,
        },
      )
    : await User.findOneAndUpdate(
        { email: req.params.email },
        { ...req.body, ...{ updatedAt: Date.now() } },
        {
          new: true,
          runValidators: true,
        },
      );
  if (!updatedUser) {
    return next(new AppError('No user found with this ID or email', 404));
  }
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
  const user = isValidId(req.params.id)
    ? await User.findByIdAndDelete(req.params.id)
    : await User.findOneAndDelete({ email: req.params.email });
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