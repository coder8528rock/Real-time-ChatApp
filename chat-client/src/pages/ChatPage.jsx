// src/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export default function ChatPage() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedName = localStorage.getItem("userName");
    if (!token) {
      navigate("/");
      return;
    }
    setUserName(savedName || "Guest");

    const s = io(SOCKET_URL, { auth: { token } });
    setSocket(s);

    s.emit("join", savedName || "Guest");

    s.on("receive_message", (data) => setChat((prev) => [...prev, data]));
    s.on("user_list", (data) => setUsers(data));

    return () => {
      s.off("receive_message");
      s.off("user_list");
      s.disconnect();
    };
  }, [navigate]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;
    const msgData = { user: userName, text: message, to: activeUser || null };
    socket.emit("send_message", msgData);
    setChat((prev) => [...prev, msgData]);
    setMessage("");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // 🔹 filteredChat logic from earlier (if you added it)
  const filteredChat = chat.filter((msg) => {
    const isGroupMsg = !msg.to;
    if (!activeUser) return isGroupMsg;

    const isFromMeToActive = msg.user === userName && msg.to === activeUser;
    const isFromActiveToMe = msg.user === activeUser && msg.to === userName;

    return isFromMeToActive || isFromActiveToMe;
  });

  return (
    <div style={styles.appShell}>
      {/* Left Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.avatarCircle}>
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={styles.userName}>{userName}</div>
            <div style={styles.userStatus}>Online</div>
          </div>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search or start a chat"
            style={styles.searchInput}
          />
        </div>

        <div style={styles.sectionTitle}>Chats</div>
        <div style={styles.chatListWrapper}>
          <ChatList
            users={users}
            activeUser={activeUser}
            onSelectUser={setActiveUser}
          />
        </div>
      </div>

      {/* Right – Chat Area */}
      <div style={styles.chatArea}>
        <div style={styles.chatHeader}>
          <div style={styles.chatHeaderInfo}>
            <div style={styles.chatAvatar}>
              {activeUser
                ? activeUser.charAt(0).toUpperCase()
                : userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={styles.chatName}>{activeUser || "Group Chat"}</div>
              <div style={styles.chatSubtitle}>
                {activeUser
                  ? "Tap here for contact info"
                  : "You are in a global room"}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.chatBody}>
          <ChatWindow chat={filteredChat} activeUser={activeUser} />
        </div>

        <div style={styles.messageBar}>
          <button style={styles.iconButton} title="Attach">
            📎
          </button>
          <input
            style={styles.messageInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            style={{
              ...styles.iconButton,
              ...styles.sendButton,
              opacity: message.trim() ? 1 : 0.6,
            }}
            onClick={sendMessage}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

// 🔹 Make sure THIS is present and below the component
const styles = {
  appShell: {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(135deg, #101827, #020617)",
    color: "#e5e7eb",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: "25%",
    maxWidth: 360,
    minWidth: 260,
    borderRight: "1px solid rgba(148, 163, 184, 0.25)",
    background: "rgba(15, 23, 42, 0.9)",
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(12px)",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.3)",
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#0f172a",
  },
  userName: {
    fontSize: 15,
    fontWeight: 600,
  },
  userStatus: {
    fontSize: 12,
    color: "#9ca3af",
  },
  logoutBtn: {
    marginLeft: "auto",
    fontSize: 12,
    border: "none",
    padding: "6px 10px",
    borderRadius: 999,
    cursor: "pointer",
    background: "rgba(239, 68, 68, 0.1)",
    color: "#fca5a5",
  },
  searchWrapper: {
    padding: "10px 12px",
  },
  searchInput: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(148, 163, 184, 0.5)",
    outline: "none",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#e5e7eb",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#9ca3af",
    padding: "4px 16px",
    marginTop: 4,
    marginBottom: 4,
  },
  chatListWrapper: {
    flex: 1,
    overflowY: "auto",
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundImage:
      "radial-gradient(circle at 0 0, rgba(56, 189, 248, 0.15), transparent 55%), radial-gradient(circle at 100% 100%, rgba(129, 140, 248, 0.2), transparent 55%)",
  },
  chatHeader: {
    height: 60,
    borderBottom: "1px solid rgba(148, 163, 184, 0.3)",
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
  },
  chatHeaderInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: "999px",
    background: "radial-gradient(circle at 0 0, #22c55e, #0ea5e9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#020617",
  },
  chatName: {
    fontSize: 15,
    fontWeight: 600,
  },
  chatSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
  },
  chatBody: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 16px",
    position: "relative",
  },
  messageBar: {
    borderTop: "1px solid rgba(148, 163, 184, 0.3)",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(15, 23, 42, 0.98)",
  },
  iconButton: {
    borderRadius: "999px",
    border: "none",
    padding: "8px 10px",
    cursor: "pointer",
    background: "rgba(15, 23, 42, 0.8)",
    boxShadow: "0 0 0 1px rgba(148, 163, 184, 0.4)",
    fontSize: 14,
  },
  sendButton: {
    boxShadow: "0 0 15px rgba(56, 189, 248, 0.5)",
  },
  messageInput: {
    flex: 1,
    borderRadius: 999,
    border: "1px solid rgba(148, 163, 184, 0.7)",
    padding: "8px 14px",
    outline: "none",
    fontSize: 14,
    background: "rgba(15, 23, 42, 0.9)",
    color: "#e5e7eb",
  },
};
