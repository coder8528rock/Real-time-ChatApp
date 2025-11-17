import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";

export function SocketProvider({ token, children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    const s = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000", {
      auth: { token },
    });

    setSocket(s);
    s.on("connect_error", (err) => console.error("socket connect error", err));

    return () => s.disconnect();
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
