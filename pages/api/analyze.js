import { analyzeMessage } from "../../lib/llm";
import { FALLBACK_RESPONSE } from "../../lib/config";

/**
 * API route to analyze a customer message.
 * Supports Case 1 (405), Case 2 (400), Case 3 (200), Case 4 (500).
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
  // CASE 1: Non-POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CASE 2: Invalid message
  const body = req.body;
  const message = body?.message;

  if (!body || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message field is required" });
  }

  try {
    // CASE 3: Valid message
    const analysis = await analyzeMessage(message.trim());
    return res.status(200).json(analysis);
  } catch (err) {
    // CASE 4: LLM failure
    console.error(`[EchoDeskAI] LLM Analysis error: ${err.message}`);
    return res.status(500).json({
      error: "Analysis failed",
      fallback: FALLBACK_RESPONSE,
    });
  }
}
