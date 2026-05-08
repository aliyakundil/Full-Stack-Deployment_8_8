import mongoose from "mongoose";

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format",
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      error: "Validation error",
      details: err.errors,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: "Duplicate key error",
      details: err.keyValue,
    });
  }

  if (err.name === "MongooseServerSelectionError") {
    return res.status(503).json({
      success: false,
      error: "Database unavailable",
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      success: false,
      error: err.message,
    });
  }

  console.error("Error:", {
    message: err.message,
    stack: err.stack,
  });

  return res.status(status).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `${req.originalUrl} does not exist`,
  });
}