const sendError = (err, req, res) => {
  // 1. API--------------------------------------------
  if (req.method === 'POST' || req.method === 'PATCH') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err: err,
      stack: err.stack
    });
  }
  // 2. RENDERED WEBSITE---------
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = `${err.statusCode}`.startsWith(`4`) ? 'FAIL' : 'ERROR';
  sendError(err, req, res);
};
