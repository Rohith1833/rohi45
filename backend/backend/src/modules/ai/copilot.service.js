const SEVERITY_COLORS = {
  LOW: '#10B981',
  MEDIUM: '#F59E0B',
  HIGH: '#DC2626',
};

const buildCopilot = (analysis) => {
  const severity = analysis.severity || 'MEDIUM';
  const emotion = analysis.emotion || 'Neutral';
  const category = analysis.category || 'General';

  return {
    summary: `Ticket auto-escalated with ${severity} severity and ${emotion} sentiment.`,
    replyDraft: analysis.replyDraft || 'Our team will review your case and help shortly.',
    suggestedAction: severity === 'HIGH' ? 'Immediate manual review' : 'Standard review',
    severityBadge: {
      label: severity,
      color: SEVERITY_COLORS[severity] || SEVERITY_COLORS.MEDIUM,
    },
    emotionLabel: emotion,
    category,
  };
};

module.exports = { buildCopilot };
