const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { defaultUserRole } = require('../utils/config');
const ImagePathBuilder = require('../utils/imagePathBuilder');

const getJwtSecret = () => process.env.JWT_SECRET;
const getJwtExpiresIn = () => process.env.JWT_EXPIRES_IN;
const getJwtCookieExpiresIn = () => process.env.JWT_COOKIE_EXPIRES_IN;

const signToken = (id) =>
  jwt.sign({ id }, getJwtSecret(), { expiresIn: getJwtExpiresIn() });

/**
 * Creates a new auth web token.
 *
 * @param {*} user an existing user.
 * @param {*} statusCode response status code.
 */
const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  // Put JWT in cookies
  const expires = new Date(
    Date.now() + getJwtCookieExpiresIn() * 24 * 60 * 60 * 1000,
  );
  res.cookie('jwt', token, {
    expires,
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      document: user,
    },
  });
};

const isMyResource = (req) =>
  req.params.userId === req.user.id || req.params.userId === req.user.email;

/**
 * Create a new user from sign up form, respond with JWT.
 */
exports.signup = catchAsync(async (req, res, next) => {
  // Validate request payload
  if (!req.body.password || req.body.password === '') {
    return next(new AppError('Please provide a password.', 400));
  }
  if (!req.body.passwordConfirm || req.body.passwordConfirm === '') {
    return next(new AppError('Please confirm your password.', 400));
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Passwords are not the same.', 400));
  }
  // Create new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    roles: [defaultUserRole],
    photo: {
      small: {
        url: new ImagePathBuilder()
          .for('user')
          .size('small')
          .name('user_photo_placeholder')
          .format('png')
          .build(),
        altText: `${req.body.name} photo`,
        mimeType: 'image/png',
      },
      thumbnail: {
        url: new ImagePathBuilder()
          .for('user')
          .size('thumbnail')
          .name('user_photo_placeholder')
          .format('png')
          .build(),
        altText: `${req.body.name} photo`,
        mimeType: 'image/png',
      },
    },
  });
  // Generate token, send response
  createAndSendToken(newUser, 201, req, res);
});

/**
 * Perform login by validating provided username and password and generating a JWT.
 */
exports.login = catchAsync(async (req, res, next) => {
  // Validate request payload
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // Get user
  const user = await User.findOne({ email }).select('+password');
  // Validate password
  if (!user || !(await user.validatePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }
  // Generate token, send response
  createAndSendToken(user, 200, req, res);
});

/**
 * Perform logout by sending back dummy JWT with short expiration time.
 */
exports.logout = (req, res) => {
  // Replace JWT value with empty and set for quick expiration
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Extract token from the request headers, check existence
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('Please log in to get access to this resource.', 401),
    );
  }
  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if user still exists
  const existingUser = await User.findById(decoded.id);
  if (!existingUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }
  // Check if user changed password after the token was issued
  if (await existingUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401),
    );
  }
  // Grant access to protected route
  req.user = existingUser;
  res.locals.user = existingUser;
  next();
});

exports.restrictTo =
  (...restrictRoles) =>
  (req, res, next) => {
    const userRoles = req.user.roles;
    const validRole = userRoles.find((role) => restrictRoles.includes(role));
    if (validRole) {
      return next();
    }
    if (restrictRoles.includes('me') && isMyResource(req)) {
      return next();
    }
    next(
      new AppError('You do not have permission to perform this action.', 403),
    );
  };
