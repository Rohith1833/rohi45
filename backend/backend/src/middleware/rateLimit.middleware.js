const rateLimit = require('express-rate-limit');

const analyzeRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down.' },
});

module.exports = { analyzeRateLimit };
