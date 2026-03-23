const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFoundMiddleware;
