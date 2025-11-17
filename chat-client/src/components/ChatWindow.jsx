// src/components/ChatWindow.jsx
import React, { useEffect, useRef } from "react";

export default function ChatWindow({ chat, activeUser }) {
  const messagesEndRef = useRef(null);
  const currentUser = localStorage.getItem("userName") || "You";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  return (
    <div style={styles.container}>
      <div style={styles.chatHeader}>
        <div style={styles.chatTitle}>
          {activeUser ? `Chat with ${activeUser}` : "Group Chat"}
        </div>
        <div style={styles.chatSubtitle}>
          {activeUser
            ? "Messages are visible only between you two."
            : "You are chatting in a shared room."}
        </div>
      </div>

      <div style={styles.chatBox}>
        {chat.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyTitle}>No messages yet</div>
            <div style={styles.emptyText}>
              Say hi 👋 to start the conversation.
            </div>
          </div>
        )}

        {chat.map((msg, i) => {
          const isMine = msg.user?.toLowerCase() === currentUser?.toLowerCase();
          return (
            <div
              key={i}
              style={{
                ...styles.messageRow,
                justifyContent: isMine ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  ...(isMine ? styles.bubbleMine : styles.bubbleOther),
                }}
              >
                {!isMine && <div style={styles.senderName}>{msg.user}</div>}
                <div style={styles.messageText}>{msg.text}</div>
                <div style={styles.metaRow}>
                  <span style={styles.timeText}>just now</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "6px 4px 10px 4px",
    borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#e5e7eb",
  },
  chatSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 2px 8px 2px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  messageRow: {
    display: "flex",
    width: "100%",
  },
  bubble: {
    maxWidth: "70%",
    borderRadius: 16,
    padding: "8px 10px 6px 10px",
    fontSize: 14,
    lineHeight: 1.4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.7)",
  },
  bubbleMine: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    alignSelf: "flex-end",
    color: "#052e16",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(148, 163, 184, 0.4)",
    alignSelf: "flex-start",
    color: "#e5e7eb",
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 11,
    fontWeight: 600,
    color: "#a5b4fc",
  },
  messageText: {
    wordBreak: "break-word",
  },
  metaRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    opacity: 0.7,
  },
  emptyState: {
    marginTop: 16,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
  },
  emptyTitle: {
    fontWeight: 500,
    marginBottom: 4,
    color: "#e5e7eb",
  },
  emptyText: {
    fontSize: 12,
  },
};
