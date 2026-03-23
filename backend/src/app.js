const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyzeRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const connectDB = require('./config/db');

// Initialize the Express app
const app = express();

// Connect to MongoDB safely
connectDB();

// Fast-execution middlewares
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for front-end integration

// Cold Start Mitigation Endpoint
// Allows frontend to wake up the server pre-emptively on load
app.get('/api/ping', (req, res) => res.status(200).json({ status: "ok" }));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', up: true }));

// Core API routes
app.use('/api', analyzeRoutes); // Encompasses rate-limited /api/analyze
app.use('/api/tickets', ticketRoutes); // /api/tickets and /api/tickets/:id/resolve

module.exports = app;
