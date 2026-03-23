import { NextResponse } from "next/server";
import { getGeminiResponse } from "@/lib/gemini";

/**
 * API route to interact with Gemini API.
 * Handles POST requests with a message and history.
 */
export async function POST(req) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // history should be an array of { role: "user" | "model", parts: [{ text: "..." }] }
    const response = await getGeminiResponse(message, history || []);

    return NextResponse.json({
      text: response,
      ts: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/chat]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
