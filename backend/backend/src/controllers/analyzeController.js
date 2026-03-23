const llmService = require('../services/llmService');
const { checkDeflection } = require('../services/deflectionService');
const ticketService = require('../services/ticketService');
const copilotService = require('../services/copilotService');
const { getFallbackResponse } = require('../utils/fallbackResponse');
const { timeout } = require('../utils/timeout');

/**
 * MASTER INTEGRATION FLOW
 * Orchestrating all dependencies securely and gracefully falling back when necessary.
 */
const analyze = async (req, res) => {
  try {
    let { message } = req.body;

    // 1. Validate securely
    if (!message || typeof message !== 'string' || message.trim().length === 0 || message.length > 500) {
      return res.status(400).json({ error: "Invalid message input" });
    }
    
    // Sanitize
    message = message.trim();

    let analysis;
    // 2. Execute LLM with SLA Protection
    try {
      analysis = await Promise.race([
        llmService.analyzeMessage(message),
        timeout(4000)
      ]);

      if (!analysis || typeof analysis !== 'object' || !analysis.severity) {
        throw new Error("Invalid structure returned from AI");
      }
    } catch (err) {
      // Immediately return fallbackResponse; DO NOT continue flow
      console.warn(`[AI SLA BREACH] Flow terminated early: ${err.message}`);
      return res.status(200).json(getFallbackResponse(message));
    }

    // 3. Execute Deflection (SYNC ONLY)
    const deflection = checkDeflection(analysis);

    // 4. Branch Logic

    // IF deflected = true:
    if (deflection.deflected === true) {
      return res.status(200).json({
        deflected: true,
        analysis,
        autoReply: deflection.autoReply
      });
    }

    // IF deflected = false:
    // Execute Database and Copilot generation safely
    const ticketDoc = await ticketService.createTicket(message, analysis);
    const copilot = await copilotService.generateCopilotSuggestions(ticketDoc, analysis);
    
    // Attempt attachment to DB. 
    await ticketService.attachCopilot(ticketDoc.id, copilot);

    // Format final structure mapped to prompt requirements: ticket variable name
    const ticket = {
      id: ticketDoc.id,
      message: ticketDoc.message,
      severity: ticketDoc.severity,
      category: ticketDoc.category,
      emotion: ticketDoc.emotion,
      aiSummary: ticketDoc.aiSummary,
      status: ticketDoc.status,
      createdAt: ticketDoc.createdAt
    };

    return res.status(200).json({
      deflected: false,
      analysis,
      ticket,
      copilot
    });

  } catch (criticalError) {
    // Ultimate Fail-Safe (DB Disconnection / Hard Errors)
    console.error(`[DB or Hard Fault CATCH] Flow routed to Fallback: ${criticalError.message}`);
    const msgFallback = req.body && req.body.message ? String(req.body.message) : "Unknown message";
    return res.status(200).json(getFallbackResponse(msgFallback));
  }
};

module.exports = { analyze };
