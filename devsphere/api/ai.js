import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Use POST."
    });
  }

  // Server-side environment variables
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;

  // Check Gemini key
  if (!GEMINI_API_KEY) {
    return res.status(503).json({
      error: "GEMINI_API_KEY is missing."
    });
  }

  // Check Firebase key
  if (!FIREBASE_API_KEY) {
    return res.status(503).json({
      error: "FIREBASE_API_KEY is missing."
    });
  }

  // Get Firebase ID token
  const authHeader = req.headers.authorization || "";

  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : "";

  // Check token before calling Firebase
  if (!idToken) {
    return res.status(401).json({
      error: "Please sign in first."
    });
  }

  try {
    // Verify Firebase user
    const who = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idToken
        })
      }
    );

    if (!who.ok) {
      return res.status(401).json({
        error: "Firebase authentication failed. Please sign in again."
      });
    }

    // Get messages
    const messages = Array.isArray(req.body?.messages)
      ? req.body.messages
          .slice(-20)
          .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            content: String(m.content || "").slice(0, 4000)
          }))
      : [];

    if (!messages.length) {
      return res.status(400).json({
        error: "No messages provided."
      });
    }

    // Gemini client
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY
    });

    // Convert conversation to text
    const conversation = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    // Generate AI response
    const response = await ai.models.generateContent({
      model: process.env.AI_MODEL || "gemini-3.8-flash",

      contents: conversation,

      config: {
        systemInstruction:
          "You are DevSphere Assistant, a concise senior software engineer. Give practical answers with short code examples."
      }
    });

    return res.status(200).json({
      reply: response.text || "No response generated."
    });

  } catch (error) {
    console.error("Gemini API error:", error);

    return res.status(502).json({
      error: "Gemini API request failed.",
      details: error.message
    });
  }
}