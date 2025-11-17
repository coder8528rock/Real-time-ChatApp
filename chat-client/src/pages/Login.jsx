import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signup = async () => {
    try {
      setLoading(true);
      const res = await API.post("/signup", { name, email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);

        // 👇 save display name for chat
        localStorage.setItem("userName", name || email);

        setAuthToken(res.data.token);
        navigate("/chat");
      } else {
        setError("Signup failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup error");
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      const res = await API.post("/login", { email, password });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);

        // 👇 use email as username if API doesn't return name
        const apiUserName = res.data.user?.name || res.data.userName || email;
        localStorage.setItem("userName", apiUserName);

        setAuthToken(res.data.token);
        navigate("/chat");
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>

      {!isLoginMode && (
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={isLoginMode ? login : signup} style={styles.button}>
        {loading ? "Please wait..." : isLoginMode ? "Login" : "Sign Up"}
      </button>

      <p>
        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setIsLoginMode(!isLoginMode)}
        >
          {isLoginMode ? "Sign Up" : "Login"}
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: "320px",
    margin: "80px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    background: "#fafafa",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
