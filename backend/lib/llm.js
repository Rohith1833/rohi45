import { FALLBACK_RESPONSE } from "./config";

const SYSTEM_PROMPT = `You are an expert AI customer support analyst. Return ONLY valid JSON. No explanation. No markdown. No extra text.`;

const TEMPLATE = `Analyze the following customer support message and return JSON with EXACTLY these fields:
severity (LOW/MEDIUM/HIGH)
category (Billing/Technical/Account/General)
reason (1 sentence)
emotion (Calm/Neutral/Frustrated/Angry)
aiSummary (1 sentence)
replyDraft (2-4 sentences)
suggestedAction (short phrase)
isL1 (boolean)

Message: "{{MESSAGE}}"

Return ONLY JSON.`;

/**
 * Normalizes any model output into a strict 8-field AnalysisResult.
 * @param {any} candidate - The raw parsed JSON from the LLM.
 * @returns {import('./config').AnalysisResult}
 */
function normalizeToAnalysis(candidate) {
  if (!candidate || typeof candidate !== "object") return FALLBACK_RESPONSE;

  return {
    severity: ["LOW", "MEDIUM", "HIGH"].includes(candidate.severity) ? candidate.severity : FALLBACK_RESPONSE.severity,
    category: ["Billing", "Technical", "Account", "General"].includes(candidate.category) ? candidate.category : FALLBACK_RESPONSE.category,
    reason: typeof candidate.reason === "string" ? candidate.reason : FALLBACK_RESPONSE.reason,
    emotion: ["Calm", "Neutral", "Frustrated", "Angry"].includes(candidate.emotion) ? candidate.emotion : FALLBACK_RESPONSE.emotion,
    aiSummary: typeof candidate.aiSummary === "string" ? candidate.aiSummary : FALLBACK_RESPONSE.aiSummary,
    replyDraft: typeof candidate.replyDraft === "string" ? candidate.replyDraft : FALLBACK_RESPONSE.replyDraft,
    suggestedAction: typeof candidate.suggestedAction === "string" ? candidate.suggestedAction : FALLBACK_RESPONSE.suggestedAction,
    isL1: typeof candidate.isL1 === "boolean" ? candidate.isL1 : FALLBACK_RESPONSE.isL1,
  };
}

/**
 * Analyzes a customer message using Google Gemini 1.5 Flash.
 * @param {string} message - The customer's support message.
 * @returns {Promise<import('./config').AnalysisResult>}
 */
export async function analyzeMessage(message) {
  if (!message || typeof message !== "string" || !message.trim()) {
    return FALLBACK_RESPONSE;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[EchoDeskAI] GEMINI_API_KEY missing - returning fallback.");
    return FALLBACK_RESPONSE;
  }

  const prompt = TEMPLATE.replace("{{MESSAGE}}", message.trim());
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) throw new Error("Empty response from LLM");

    // Clean markdown code blocks and parse
    const cleanJson = rawText.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    return normalizeToAnalysis(JSON.parse(cleanJson));
  } catch (err) {
    console.error(`[EchoDeskAI] analyzeMessage error: ${err.message}`);
    return FALLBACK_RESPONSE;
  } finally {
    clearTimeout(timeoutId);
  }
}
