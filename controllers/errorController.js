const AppError = require('../utils/appError');

/**
 * Formats and returns an error for development environment.
 */
const sendErrorDev = (err, req, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });

/**
 * Returns an error for development environment.
 */
const sendErrorProd = (err, req, res) => {
  // Operational (trusted) error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or unknown error: don't expose error details
  console.error('ERROR: ', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong...',
  });
};

/**
 * Handles MongoDB error of the type 'CastError'.
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handles MongoDB error with the code 11000.
 */
const handleDuplicateFieldsDB = (err) => {
  // keyValue holds the conflicting field, whichever it is — reading a fixed key
  // here reported "undefined" for every duplicate other than `name`.
  const [field, value] = Object.entries(err.keyValue ?? {})[0] ?? [];
  const message = field
    ? `Duplicate value for ${field}: ${value}. Please use another value.`
    : 'Duplicate field value. Please use another value.';
  return new AppError(message, 400);
};

/**
 * Handles MongoDB validation error.
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handles JWT error 'JsonWebTokenError'.
 */
const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);

/**
 * Handles JWT error 'TokenExpiredError'.
 */
const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    // Inspect `err` itself rather than a `{ ...err }` copy: Mongoose defines
    // `name` on the error prototype, so spreading dropped it and the CastError
    // branch below could never match. Each handler returns a fresh AppError,
    // so there is nothing to protect against mutation here.
    let error = err;

    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    } else if (err.name === 'ValidationError') {
      // Mongoose prefixes `_message` with the model name ("User validation
      // failed"), so match on the stable `name` instead.
      error = handleValidationErrorDB(err);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, req, res);
  } else {
    sendErrorDev(err, req, res);
  }
};
