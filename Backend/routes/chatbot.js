import express from "express";
import { askFurnitoAssistant } from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/ask", askFurnitoAssistant);

export default router;
