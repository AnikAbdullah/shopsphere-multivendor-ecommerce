const env = require("../config/env");

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    statusCode,
    success: false,
    message: err.message || "Internal server error",
    errors: err.errors || [],
  };

  if (!env.isProduction) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
