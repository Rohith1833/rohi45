const { OpenAI } = require('openai');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const {
  SYSTEM_INSTRUCTION,
  buildAnalyzePrompt,
  DEMO_STUBS,
} = require('./prompt.templates');

const VALID_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];
const VALID_CATEGORIES = ['Billing', 'Technical', 'Account', 'General'];
const VALID_EMOTIONS = ['Calm', 'Neutral', 'Frustrated', 'Angry'];

const normalize = (raw) => {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  return {
    severity: VALID_SEVERITIES.includes(raw.severity) ? raw.severity : 'MEDIUM',
    category: VALID_CATEGORIES.includes(raw.category) ? raw.category : 'General',
    emotion: VALID_EMOTIONS.includes(raw.emotion) ? raw.emotion : 'Neutral',
    aiSummary: typeof raw.aiSummary === 'string' ? raw.aiSummary : 'Manual review required.',
    reason: typeof raw.reason === 'string' ? raw.reason : '',
    replyDraft: typeof raw.replyDraft === 'string' ? raw.replyDraft : 'Our team will assist you shortly.',
    suggestedAction: typeof raw.suggestedAction === 'string' ? raw.suggestedAction : 'Manual review',
    isL1: typeof raw.isL1 === 'boolean' ? raw.isL1 : false,
  };
};

const getStub = (message) => {
  const loweredMessage = message.toLowerCase();
  return DEMO_STUBS.find(({ keywords }) =>
    keywords.some((keyword) => loweredMessage.includes(keyword))
  )?.stub || null;
};

const simulateTestBehavior = async (message) => {
  if (message.includes('__mock_fail__')) {
    throw new Error('Simulated LLM failure');
  }

  if (message.includes('__mock_timeout__')) {
    await new Promise((resolve) => setTimeout(resolve, 6000));
    return {
      severity: 'LOW',
      category: 'General',
      emotion: 'Calm',
      aiSummary: 'Timeout simulation',
      reason: 'Timeout simulation',
      replyDraft: 'Timeout simulation',
      suggestedAction: 'Timeout simulation',
      isL1: true,
    };
  }

  return null;
};

const analyzeWithLLM = async (message) => {
  const simulation = await simulateTestBehavior(message);
  if (simulation) {
    return simulation;
  }

  const stub = getStub(message);
  if (stub) {
    logger.info(`Using demo stub for message: ${message.substring(0, 50)}`);
    return stub;
  }

  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: env.MODEL_NAME,
    messages: [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      { role: 'user', content: buildAnalyzePrompt(message) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 400,
  });

  const raw = JSON.parse(response.choices[0].message.content);
  const normalized = normalize(raw);

  if (!normalized) {
    throw new Error('AI returned invalid JSON structure');
  }

  return normalized;
};

module.exports = { analyzeWithLLM };
