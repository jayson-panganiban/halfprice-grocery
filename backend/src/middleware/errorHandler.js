const { AppError, DatabaseConnectionError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new AppError('Invalid JSON payload', 400);
  }

  if (error instanceof DatabaseConnectionError) {
    logger.error('Database connection error:', error);
    return res.status(error.statusCode).json({
      status: error.status,
      message: 'A database error occurred. Please try again later.',
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  logger.error(err);

  const internalError = new AppError('Internal server error', 500);
  res.status(internalError.statusCode).json({
    status: internalError.status,
    message: internalError.message,
  });
};

module.exports = errorHandler;
