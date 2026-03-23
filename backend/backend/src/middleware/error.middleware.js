const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} -> ${err.message}`);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.statusCode || 500).json({
    error: err.publicMessage || 'Internal server error',
  });
};

module.exports = errorMiddleware;
