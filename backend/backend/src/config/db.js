const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    logger.success(`MongoDB connected on ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`MongoDB unavailable, fallback mode enabled: ${error.message}`);
  }
};

module.exports = connectDB;
