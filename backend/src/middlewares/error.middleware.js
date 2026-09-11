import { ValidationError } from "sequelize";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details;

  if (error instanceof ValidationError) {
    statusCode = 400;
    message = "Database validation failed";
    details = error.errors.map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    statusCode = 400;
    message = "Request body contains invalid JSON";
  }

  if (statusCode >= 500) console.error(error);

  const response = {
    success: false,
    message,
  };

  if (details !== undefined) response.details = details;
  if (env.nodeEnv === "development" && !error.isOperational) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

