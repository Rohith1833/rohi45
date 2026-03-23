const getFallback = (message = 'Unknown message') => ({
  deflected: false,
  meta: {
    fallback: true,
    reason: 'AI or database service temporarily unavailable',
  },
  analysis: {
    severity: 'HIGH',
    category: 'General',
    emotion: 'Neutral',
    aiSummary: 'Fallback response generated because the primary workflow was unavailable.',
    reason: 'Manual review required.',
    replyDraft: 'We are experiencing delays and will assist you shortly.',
    suggestedAction: 'Manual review',
    isL1: false,
  },
  ticket: {
    id: `tkt_fallback_${Date.now()}`,
    message: String(message).substring(0, 150),
    severity: 'HIGH',
    category: 'General',
    emotion: 'Neutral',
    status: 'Open',
    createdAt: new Date().toISOString(),
  },
  copilot: {
    summary: 'Fallback case created for manual review.',
    replyDraft: 'We are experiencing delays and will assist you shortly.',
    suggestedAction: 'Manual review',
    severityBadge: {
      label: 'HIGH',
      color: '#DC2626',
    },
    emotionLabel: 'Neutral',
    category: 'General',
  },
});

module.exports = { getFallback };
