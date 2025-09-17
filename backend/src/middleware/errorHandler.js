const errorHandler = (err, req, res, next) => {
  // Determine the status code. Default to 500 (Internal Server Error) if not already set.
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    // Provide the stack trace only in the development environment for debugging.
    // In production, we don't want to expose implementation details.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;