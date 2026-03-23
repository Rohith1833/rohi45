/**
 * Synchronous L1 Deflection Decider (Part 3)
 * Pure sync engine responsible ONLY for deflection math. No side effects.
 */
const checkDeflection = (result) => {
  if (!result || typeof result !== 'object') return { deflected: false };

  // Only mathematically deflect if explicit L1 intent against LOW risk
  if (result.isL1 === true && result.severity === "LOW") {
    return { deflected: true, autoReply: result.replyDraft };
  }

  return { deflected: false };
};

module.exports = { checkDeflection };
