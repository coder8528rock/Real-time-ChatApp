import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";
import { SocketProvider } from "./Context/SocketProvider"; // ✅ Import SocketProvider
//import "./styles.css";

const token = localStorage.getItem("token"); // ✅ Use saved token from login

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider token={token}>
      {" "}
      {/* ✅ Wrap everything inside */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Login />} />
            <Route path="chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </React.StrictMode>
);
