/**
 * Utility to enforce strict SLAs on asynchronous operations.
 * If an operation exceeds the defined ms limit, this promise rejects.
 *
 * @param {number} ms - Milliseconds before throwing a TimeoutError
 * @returns {Promise<never>} Rejects after ms
 */
const timeout = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout of ${ms}ms exceeded`));
    }, ms);
  });
};

module.exports = { timeout };
