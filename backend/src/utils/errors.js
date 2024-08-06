class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
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

// TODO: Implement duplicate submission
class ConflictError extends ApiError {
  constructor(message) {
    super(message || "Duplicate submission, 409");
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
  ConflictError,
  InternalServerError,
};
