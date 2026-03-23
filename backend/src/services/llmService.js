const { OpenAI } = require('openai');

/**
 * Real LLM Analytics Connector integrating securely with OpenAI.
 * Guaranteed to return native JSON mappings ensuring structural compliance.
 */
const analyzeMessage = async (message) => {
  try {
    // Structural Key verification 
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("API Key Undefined. Safety limits triggering fallback.");
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are a Customer Support Intelligence router. Read the user message and return ONLY valid JSON with this exact structural mapping:
    {
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "category": "Billing" | "Technical Support" | "General Inquiry" | "Bug Report" | "Unknown",
      "emotion": "Neutral" | "Frustrated" | "Angry" | "Happy",
      "aiSummary": "A very concise 1 sentence summary outlining the issue",
      "intent": "a 1-word tag routing the issue",
      "isL1": true or false (true if low severity generic request able to be deflected),
      "replyDraft": "Generate a concise 1-sentence draft reply for humans or L1 handlers.",
      "reason": "Why you assigned this severity/category"
    }`;

    // Request guaranteed JSON formats asynchronously.
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" }
    });

    const outputString = response.choices[0].message.content;
    const parsedData = JSON.parse(outputString);

    return parsedData;

  } catch (error) {
    // Explicit throw: We absolutely DO NOT mock answers anymore.
    // Real issues trigger the SRE outer fail-safe layer in AnalyzeController!
    console.error(`[AI CRITICAL]: Open AI Request Exception - ${error.message}`);
    throw error;
  }
};

module.exports = { analyzeMessage };
