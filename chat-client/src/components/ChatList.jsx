// src/components/ChatList.jsx
import React from "react";

export default function ChatList({ users, activeUser, onSelectUser }) {
  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <span style={styles.title}>Chats</span>
        <span style={styles.countBadge}>{users.length}</span>
      </div>

      {users.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyAvatar}>?</div>
          <div>
            <div style={styles.emptyTitle}>No users online</div>
            <div style={styles.emptySubtitle}>
              Open another browser / device and log in with a different user to
              start a chat.
            </div>
          </div>
        </div>
      )}

      {users.map((user, i) => {
        const isActive = activeUser === user;
        return (
          <div
            key={i}
            onClick={() => onSelectUser(user)}
            style={{
              ...styles.userItem,
              ...(isActive ? styles.userItemActive : {}),
            }}
          >
            <div style={styles.left}>
              <div style={styles.avatar}>
                {user?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div style={styles.textBlock}>
                <div style={styles.userName}>{user}</div>
                <div style={styles.userSubtitle}>Online now</div>
              </div>
            </div>
            <div style={styles.statusDotWrapper}>
              <span style={styles.statusDot} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    padding: "6px 8px 12px 8px",
    height: "100%",
    overflowY: "auto",
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "4px 6px 8px 6px",
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "#9ca3af",
  },
  countBadge: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 999,
    background: "rgba(148, 163, 184, 0.15)",
    color: "#e5e7eb",
  },

  userItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 10px",
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 4,
    transition: "background 0.15s ease, transform 0.08s ease",
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.2)",
  },
  userItemActive: {
    background:
      "linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(59, 130, 246, 0.35))",
    border: "1px solid rgba(59, 130, 246, 0.7)",
    transform: "translateY(-1px)",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: "999px",
    background: "radial-gradient(circle at 30% 0, #22c55e, #0ea5e9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    color: "#020617",
    flexShrink: 0,
  },

  textBlock: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#e5e7eb",
    maxWidth: 160,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userSubtitle: {
    fontSize: 11,
    color: "#9ca3af",
  },

  statusDotWrapper: {
    display: "flex",
    alignItems: "center",
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: "999px",
    background: "#22c55e",
    boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.25)",
  },

  emptyState: {
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px dashed rgba(148, 163, 184, 0.4)",
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  emptyAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid rgba(148, 163, 184, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    color: "#9ca3af",
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#e5e7eb",
  },
  emptySubtitle: {
    fontSize: 11,
    color: "#9ca3af",
  },
};
