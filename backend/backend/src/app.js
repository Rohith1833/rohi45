const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const apiRoutes = require('./routes');
const notFoundMiddleware = require('./middleware/notFound.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

app.use('/api', apiRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
