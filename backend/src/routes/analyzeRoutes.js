const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const analyzeController = require('../controllers/analyzeController');

// Priority: Limit cost explosion / Spam mitigation
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10,             // limit each IP to 10 requests per minute
  message: { error: "Too many requests, please slow down" },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Protect only the orchestration layer!
router.post('/analyze', analyzeLimiter, analyzeController.analyze);

module.exports = router;
