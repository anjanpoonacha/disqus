const AppError = require('./../utils/appError');

const handleJWTError = () =>
  new AppError('Invalid Token. Please login again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Invalid Token. Please login again.', 401);

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Can't have duplicate field of ${value[0]}. Please choose another field.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // 1. API--------------------------------------------
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      stack: err.stack
    });
  }
  // 2. RENDERED WEBSITE--------------------------------
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // 1. API ----------------------------------------------
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    //  PROGRAMMING AND OTHER UNKNOWN ERRORS ARE HANDLED
    // LOG THE ERROR IN THE PLATFORM
    console.error('ERROR 💥', err);

    // SEND A GENERIC MESSAGE
    return res.status(500).json({
      status: 'ERROR',
      message: `Something went wrong!`
    });
  }
  // 2. RENDERED WEBSITE-------------------------------------
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = `${err.statusCode}`.startsWith(`4`) ? 'FAIL' : 'ERROR';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
    //
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
