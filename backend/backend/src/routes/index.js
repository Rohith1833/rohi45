const express = require('express');
const analyzeRoutes = require('../modules/analyze/analyze.routes');
const ticketRoutes = require('../modules/ticket/ticket.routes');

const router = express.Router();

router.get('/ping', (req, res) => {
  res.status(200).json({
    status: 'ok',
    ts: Date.now(),
    uptime: process.uptime(),
  });
});

router.use('/analyze', analyzeRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
