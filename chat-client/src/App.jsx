import React from "react";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div
      style={{ maxWidth: 900, margin: "20px auto", fontFamily: "sans-serif" }}
    >
      <h2>Chat App </h2>
      <Outlet />
    </div>
  );
}
