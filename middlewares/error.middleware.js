import { logger } from "../config/logger.js";
import { config } from "../config/config.js";

export const errorHandler = (err, req, res, next) => {
  const userId = req.user?.id || "anonymous";
  const statusCode = err.status || 500;

  const errorLog =
    `[${new Date().toISOString()}] ` +
    `[ERROR] ` +
    `[${req.originalUrl}] ` +
    `[enterprise-saas] ` +
    `[${config.nodeEnv}] ` +
    `[${req.requestId || "N/A"}] ` +
    `[${req.method}] ` +
    `[${statusCode}] ` +
    `[${userId}] ` +
    `[${req.ip}] ` +
    `[${err.message}]`;

  logger.error(errorLog);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};
