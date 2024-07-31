const { ApiError } = require("../utils/errors");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  logger.error(err);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

module.exports = errorHandler;
