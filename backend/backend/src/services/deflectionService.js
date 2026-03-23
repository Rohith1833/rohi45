/**
 * L1 Deflection Logic: PURE Synchronous Decision Engine
 */
const checkDeflection = (result) => {
  if (!result || typeof result !== 'object') return { deflected: false };

  // ONLY RULE: Deflect iff it's an L1 issue AND severity is LOW
  if (result.isL1 === true && result.severity === "LOW") {
    return { deflected: true, autoReply: result.replyDraft };
  }

  // Default to escalation (catch-all for missing fields, MEDIUM/HIGH severity, etc)
  return { deflected: false };
};

module.exports = { checkDeflection };
