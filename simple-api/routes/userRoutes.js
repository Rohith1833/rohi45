const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
});

// @desc    Create new user
// @route   POST /api/users
// @access  Public
router.post(
    '/',
    [
        body('name', 'Name is required').notEmpty(),
        body('email', 'Email is required').isEmail().withMessage('Please include a valid email')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const user = await User.create(req.body);

            res.status(201).json({
                success: true,
                data: user
            });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
