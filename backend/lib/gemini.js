import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Sends a message to Gemini and returns the response.
 * @param {string} prompt - The user's input.
 * @param {Array<{role: string, parts: Array<{text: string}>}>} history - Previous messages.
 * @returns {Promise<string>}
 */
export async function getGeminiResponse(prompt, history = []) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  // Use gemini-1.5-flash for speed and efficiency
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("[Gemini Service Error]:", error);
    throw new Error(error.message || "Failed to communicate with Gemini API.");
  }
}
