import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import Message from "./models/Message.js";
import { authMiddlewareSocket } from "./middleware/authMiddleware.js";

dotenv.config();
console.log("MONGO_URI from env:", process.env.MONGO_URI);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/messages", messageRoutes);

// 🔹 Socket.IO Logic

// Map username -> socket.id (for direct messaging)
const userToSocket = new Map();
// Map socket.id -> username (for cleanup on disconnect)
const socketToUser = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    // Save mappings
    userToSocket.set(username, socket.id);
    socketToUser.set(socket.id, username);

    // Send updated user list to all clients
    io.emit("user_list", Array.from(userToSocket.keys()));
    console.log(`${username} joined`);
  });

  socket.on("send_message", async (data) => {
    const { user, text, to } = data;

    // Save to DB (you already had this)
    const newMsg = new Message({
      user,
      text,
      to: to || null,
      createdAt: new Date(),
    });
    await newMsg.save();

    // Group chat (no 'to' user) -> broadcast to everyone
    if (!to) {
      const msg = { user, text, to: null };
      io.emit("receive_message", msg);
      return;
    }

    // 🔹 Private message flow
    const targetSocketId = userToSocket.get(to);
    const senderSocketId = userToSocket.get(user);

    const msg = { user, text, to };

    // send to receiver (if online)
    if (targetSocketId) {
      io.to(targetSocketId).emit("receive_message", msg);
    }

    // also send back to sender so it appears in their chat UI
    if (senderSocketId) {
      io.to(senderSocketId).emit("receive_message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const username = socketToUser.get(socket.id);
    if (username) {
      userToSocket.delete(username);
      socketToUser.delete(socket.id);
    }

    // Update user list for everyone
    io.emit("user_list", Array.from(userToSocket.keys()));
  });
});

// 🔹 MongoDB Connect + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () =>
      console.log(`✅ Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
