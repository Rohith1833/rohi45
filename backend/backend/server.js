require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      logger.success(`Unified backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error(`Critical failure during startup: ${error.message}`);
    process.exit(1);
  }
};

startServer();
