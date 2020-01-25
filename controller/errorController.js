const sendError = (err, req, res) => {
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = `${err.statusCode}`.startsWith(`4`) ? 'FAIL' : 'ERROR';
  sendError(err, req, res);

  // if (process.env.NODE_ENV === 'development') {
  //   sendErrorDev(err, req, res);
  //   //
  // } else if (process.env.NODE_ENV === 'production') {
  //   let error = { ...err };
  //   error.message = err.message;

  //   if (error.name === 'CastError') error = handleCastErrorDB(error);
  //   if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  //   if (error.name === 'ValidationError')
  //     error = handleValidationErrorDB(error);
  //   if (error.name === 'JsonWebTokenError') error = handleJWTError();
  //   if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  //   sendErrorProd(error, req, res);
  // }
};
