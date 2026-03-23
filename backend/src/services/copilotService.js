/**
 * Copilot Formatter Service (Part 5)
 * Builds secure structured objects mapping data properties organically for UI payloads.
 */
const generateCopilotSuggestions = async (ticketData, analysisResult) => {
  const safeEmotion = (analysisResult.emotion && String(analysisResult.emotion).trim() !== "") 
    ? analysisResult.emotion 
    : "Neutral";

  let badgeColor = "#10B981"; 
  if (analysisResult.severity === "MEDIUM") badgeColor = "#F59E0B"; 
  if (analysisResult.severity === "HIGH") badgeColor = "#DC2626";

  return {
    summary: `System automatically escalated due to ${analysisResult.severity} severity status.`,
    replyDraft: analysisResult.replyDraft || `Hello, I see you are having an issue. I'm here to help.`,
    suggestedAction: analysisResult.severity === "HIGH" ? "Immediate Manual Review" : "Standard Review",
    severityBadge: {
      label: analysisResult.severity || "LOW",
      color: badgeColor
    },
    emotionLabel: safeEmotion,
    category: analysisResult.category || "General Inquiry"
  };
};

module.exports = { generateCopilotSuggestions };
