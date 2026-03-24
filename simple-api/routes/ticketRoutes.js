const express = require('express');
const Ticket = require('../models/Ticket');
const router = express.Router();

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Public
router.post('/', async (req, res, next) => {
    try {
        const { title, description, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, error: 'Please provide title and description' });
        }

        const ticket = await Ticket.create({
            title,
            description,
            status: status || 'Open'
        });

        res.status(201).json({
            success: true,
            data: ticket
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
