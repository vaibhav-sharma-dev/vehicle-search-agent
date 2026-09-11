export class AppError extends Error {
  constructor(message, statusCode = 500, details = undefined, cause = undefined) {
    super(message, cause ? { cause } : undefined);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
