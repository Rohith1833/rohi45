const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 30000,
    };
    const conn = await mongoose.connect(env.MONGO_URI, options);
    logger.success(`MongoDB connected on ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    throw error; // Let server.js handle it
  }
};

module.exports = connectDB;
