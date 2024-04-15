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
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const value = err.keyValue.name;
  const message = `Duplicate field value ${value}. Please use another value.`;
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
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

/**
 * Handles JWT error 'TokenExpiredError'.
 */
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error._message === 'Validation failed') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, req, res);
  }
};
