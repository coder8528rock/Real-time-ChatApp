import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET);
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET);
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
