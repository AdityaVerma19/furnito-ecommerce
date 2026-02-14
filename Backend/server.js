import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import paymentRoutes from "./routes/payment.js";
import orderRoutes from "./routes/orders.js";
import chatbotRoutes from "./routes/chatbot.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = (process.env.MONGO_URI || "").trim();
const configuredOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  "http://localhost:3000,http://127.0.0.1:3000,https://kinsley-drearies-honey.ngrok-free.dev"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const privateDevOriginPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(:\d+)?$/;
const vercelOriginPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

const isAllowedOrigin = (origin) =>
  configuredOrigins.includes(origin) ||
  privateDevOriginPattern.test(origin) ||
  vercelOriginPattern.test(origin);

const redactMongoUri = (uri) => uri.replace(/\/\/([^@]+)@/, "//***:***@");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin/non-browser tools with no Origin header.
      if (!origin) return callback(null, true);
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/contact", contactRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  if (typeof err?.message === "string" && err.message.startsWith("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is required. Configure MongoDB Atlas URI in Backend/.env");
    }

    if (!MONGO_URI.startsWith("mongodb+srv://")) {
      throw new Error("MONGO_URI must be an Atlas connection string (mongodb+srv://...)");
    }

    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${redactMongoUri(MONGO_URI)}`);

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
