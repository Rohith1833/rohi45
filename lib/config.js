/**
 * @typedef {Object} AnalysisResult
 * @property {"LOW" | "MEDIUM" | "HIGH"} severity
 * @property {"Billing" | "Technical" | "Account" | "General"} category
 * @property {string} reason
 * @property {"Calm" | "Neutral" | "Frustrated" | "Angry"} emotion
 * @property {string} aiSummary
 * @property {string} replyDraft
 * @property {string} suggestedAction
 * @property {boolean} isL1
 */

/** @type {AnalysisResult} */
export const FALLBACK_RESPONSE = {
  severity: "MEDIUM",
  category: "General",
  reason: "Fallback response due to analysis system error",
  emotion: "Neutral",
  aiSummary: "Message received, manual review needed.",
  replyDraft: "Thank you for reaching out. Our team will review your case shortly.",
  suggestedAction: "Manual Review",
  isL1: false,
};
