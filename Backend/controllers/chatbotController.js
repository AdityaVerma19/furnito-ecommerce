const getGeminiConfig = () => ({
  model: (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim(),
  apiKey: (process.env.GEMINI_API_KEY || "").trim(),
});

const SYSTEM_INSTRUCTION = `
You are the official Furnito website assistant.
You must answer only questions related to Furnito, including:
- Furnito furniture products and categories
- pricing, offers, and product recommendations
- shipping, returns, warranty, and customer service
- website navigation and help using Furnito features
- order, payment, and checkout guidance

If the user asks about anything unrelated to Furnito, politely refuse and redirect to Furnito topics.
Keep responses concise, helpful, and customer-friendly.
`.trim();

const normalizeHistory = (rawHistory = []) =>
  (Array.isArray(rawHistory) ? rawHistory : [])
    .map((entry) => ({
      role: entry?.role === "assistant" ? "model" : "user",
      text: String(entry?.text || "").trim(),
    }))
    .filter((entry) => entry.text)
    .slice(-8);

const buildGeminiPayload = (history, message) => ({
  systemInstruction: {
    parts: [{ text: SYSTEM_INSTRUCTION }],
  },
  contents: [
    ...history.map((entry) => ({
      role: entry.role,
      parts: [{ text: entry.text }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ],
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 400,
  },
});

const extractGeminiReply = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("")
    .trim();
};

export const askFurnitoAssistant = async (req, res) => {
  try {
    const { model, apiKey } = getGeminiConfig();
    const message = String(req.body?.message || "").trim();
    const history = normalizeHistory(req.body?.history);

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    if (!apiKey) {
      return res.status(500).json({
        message: "Gemini is not configured on server. Add GEMINI_API_KEY in Backend/.env",
      });
    }

    if (typeof fetch !== "function") {
      return res.status(500).json({
        message: "Server runtime does not support fetch(). Use Node.js 18+.",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildGeminiPayload(history, message)),
      }
    );

    const responsePayload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const upstreamMessage =
        responsePayload?.error?.message || "Unable to get response from Gemini.";
      return res.status(502).json({ message: upstreamMessage });
    }

    const reply = extractGeminiReply(responsePayload);
    if (!reply) {
      return res.status(502).json({ message: "Assistant returned an empty response." });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("askFurnitoAssistant error:", error);
    return res.status(500).json({ message: "Unable to process chat request." });
  }
};
