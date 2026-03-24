const withTimeout = (promise, ms = 30000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
    }),
  ]);

module.exports = { withTimeout };
