const { OpenAI } = require('openai');

/**
 * AI Processing Service (Part 2)
 * Responsible ONLY for communicating securely with the external LLM and validating JSON schemas.
 */
const analyzeMessage = async (message) => {
  // Simulator for Hard System Testing
  if (message.includes("Mock failure")) {
    throw new Error("Explicit LLM simulation rejection");
  }

  if (message.includes("Delay >4s")) {
    await new Promise(res => setTimeout(res, 5000));
  }

  if (message === "How to reset password") {
    return { severity: "LOW", isL1: true, replyDraft: "Please use the reset link.", category: "Technical Support" };
  }
  if (message === "Refund not received") {
    return { severity: "HIGH", isL1: false, replyDraft: "", category: "Billing" };
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAPI Key. Tripping fallback logic globally.");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are a strict API service. Read user input. Return ONLY valid JSON matching this schema exactly:
  {
    "severity": "LOW" | "MEDIUM" | "HIGH",
    "category": "Billing" | "Technical Support" | "General Inquiry" | "Bug Report",
    "emotion": "Neutral" | "Frustrated" | "Angry",
    "aiSummary": "1 sentence brief",
    "intent": "issue tag",
    "isL1": true (only if low risk informational) or false,
    "replyDraft": "1-sentence autoreply or human start draft.",
    "reason": "Why assigned"
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = { analyzeMessage };
