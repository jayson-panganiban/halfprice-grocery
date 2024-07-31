class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message) {
    super(message || "Bad Request", 400);
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(message || "Resource not found", 404);
  }
}

class InternalServerError extends ApiError {
  constructor(message) {
    super(message || "Internal Server Error", 500);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
};
