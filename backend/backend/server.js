require('dotenv').config();
const app = require('./src/app');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');

app.listen(env.PORT, () => {
  logger.success(`Unified backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
