/**
 * Fallback response mechanism to guarantee system 100% uptime.
 * Triggered on AI API failure or Timeouts or DB failures.
 */
const getFallbackResponse = (message) => {
  return {
    deflected: false,
    meta: {
      fallback: true,
      reason: "AI unavailable"
    },
    analysis: {
      severity: "HIGH",
      category: "Billing",
      reason: "Fallback due to AI failure",
      emotion: "Frustrated",
      aiSummary: "Customer issue auto-handled due to AI failure",
      isL1: false
    },
    ticket: {
      id: `tkt_fallback_${Date.now()}`,
      message: (message || "Fallback generated").substring(0, 120),
      severity: "HIGH",
      category: "Billing",
      emotion: "Frustrated",
      status: "Open",
      createdAt: new Date().toISOString()
    },
    copilot: {
      summary: "Fallback case generated",
      replyDraft: "We are currently experiencing delays. Our team will assist you shortly.",
      suggestedAction: "Manual Review",
      severityBadge: { label: "HIGH", color: "#DC2626" },
      emotionLabel: "Frustrated",
      category: "Billing"
    }
  };
};

module.exports = { getFallbackResponse };
