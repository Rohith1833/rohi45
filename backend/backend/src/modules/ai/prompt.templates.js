const SYSTEM_INSTRUCTION =
  'You are an expert customer support triage assistant. Return only valid JSON with no markdown or extra prose.';

const buildAnalyzePrompt = (message) =>
  `Analyze the customer support message below and return JSON with exactly these keys:
{
  "severity": "LOW" | "MEDIUM" | "HIGH",
  "category": "Billing" | "Technical" | "Account" | "General",
  "emotion": "Calm" | "Neutral" | "Frustrated" | "Angry",
  "aiSummary": "short summary",
  "reason": "why this severity/category was chosen",
  "replyDraft": "short professional reply",
  "suggestedAction": "next action",
  "isL1": true only if the issue can be solved through self-service, otherwise false
}

Customer message: "${message}"`;

const DEMO_STUBS = [
  {
    keywords: ['reset password', 'forgot password', 'change password'],
    stub: {
      severity: 'LOW',
      category: 'Technical',
      emotion: 'Neutral',
      aiSummary: 'Customer needs password reset guidance.',
      reason: 'Password reset is a standard self-service workflow.',
      replyDraft: "Please use the 'Forgot Password' option on the sign-in page to reset your password.",
      suggestedAction: 'Share reset instructions',
      isL1: true,
    },
  },
  {
    keywords: ['refund', 'charged twice', 'double charge', 'billing issue'],
    stub: {
      severity: 'HIGH',
      category: 'Billing',
      emotion: 'Frustrated',
      aiSummary: 'Customer is reporting an urgent billing problem.',
      reason: 'Refund and charge disputes need manual billing review.',
      replyDraft: 'I am escalating this billing issue to our support team for immediate review.',
      suggestedAction: 'Escalate to billing',
      isL1: false,
    },
  },
  {
    keywords: ['hacked', 'account compromised', 'unauthorized access', 'someone logged in'],
    stub: {
      severity: 'HIGH',
      category: 'Account',
      emotion: 'Angry',
      aiSummary: 'Customer suspects unauthorized account access.',
      reason: 'Potential account compromise requires urgent manual handling.',
      replyDraft: 'We are treating this as a priority security issue and escalating it now.',
      suggestedAction: 'Escalate to security',
      isL1: false,
    },
  },
];

module.exports = {
  SYSTEM_INSTRUCTION,
  buildAnalyzePrompt,
  DEMO_STUBS,
};
