const { ApiError } = require("../utils/errors");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    error = new ApiError("Invalid JSON payload", 400);
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  logger.error(err);

  const internalError = new ApiError("Internal server error", 500);
  res.status(internalError.statusCode).json({
    status: internalError.status,
    message: internalError.message,
  });
};

module.exports = errorHandler;
