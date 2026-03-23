const express = require('express');
const { analyze } = require('./analyze.controller');
const { analyzeRateLimit } = require('../../middleware/rateLimit.middleware');
const { validateAnalyze } = require('../../middleware/validate.middleware');

const router = express.Router();

router.post('/', analyzeRateLimit, validateAnalyze, analyze);
router.all('/', (req, res) => {
  res.status(405).json({ error: 'Method not allowed' });
});

module.exports = router;
