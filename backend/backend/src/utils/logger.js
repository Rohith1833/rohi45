console.log('--- LOGGER.JS LOADED ---');
const logger = {
  info: (message) => console.log(`[backend] INFO: ${message}`),
  warn: (message) => console.warn(`[backend] WARN: ${message}`),
  error: (message) => console.error(`[backend] ERROR: ${message}`),
  success: (message) => console.log(`[backend] OK: ${message}`),
};

module.exports = logger;
