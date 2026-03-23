const { analyzeWithLLM } = require('../ai/llm.service');
const { buildCopilot } = require('../ai/copilot.service');
const ticketService = require('../ticket/ticket.service');
const { withTimeout } = require('../../utils/timeout');
const { getFallback } = require('../../utils/fallback');
const env = require('../../config/env');
const logger = require('../../utils/logger');

const checkDeflection = (analysis) => {
  if (!analysis || typeof analysis !== 'object') {
    return { deflected: false };
  }

  if (analysis.isL1 === true && analysis.severity === 'LOW') {
    return {
      deflected: true,
      autoReply: analysis.replyDraft,
    };
  }

  return { deflected: false };
};

const processMessage = async (message) => {
  let analysis;

  try {
    analysis = await withTimeout(analyzeWithLLM(message), env.LLM_TIMEOUT_MS);
  } catch (error) {
    logger.warn(`Analyze flow switched to fallback after AI failure: ${error.message}`);
    return getFallback(message);
  }

  const deflection = checkDeflection(analysis);
  if (deflection.deflected) {
    return {
      deflected: true,
      analysis,
      autoReply: deflection.autoReply,
    };
  }

  let ticket;
  try {
    ticket = await ticketService.createTicket(message, analysis);
  } catch (error) {
    logger.warn(`Analyze flow switched to fallback after DB failure: ${error.message}`);
    return getFallback(message);
  }

  const copilot = buildCopilot(analysis);
  await ticketService.attachCopilot(ticket.id, copilot);

  return {
    deflected: false,
    analysis,
    ticket: {
      id: ticket.id,
      message: ticket.message,
      severity: ticket.severity,
      category: ticket.category,
      emotion: ticket.emotion,
      aiSummary: ticket.aiSummary,
      status: ticket.status,
      createdAt: ticket.createdAt,
    },
    copilot,
  };
};

module.exports = {
  checkDeflection,
  processMessage,
};
