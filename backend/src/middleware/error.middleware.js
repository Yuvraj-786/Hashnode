
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Request body contains invalid JSON";
  }

  console.error(`[${new Date().toISOString()}] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;