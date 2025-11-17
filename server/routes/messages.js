import express from "express";
import Message from "../models/Message.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all messages (public chat)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
