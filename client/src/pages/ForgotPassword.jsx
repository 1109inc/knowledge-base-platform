import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "Reset link sent!");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Forgot your password?</h2>
        <p style={styles.subtext}>
          Enter the email address associated with your account, and we'll email you a link to reset your password.
        </p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Send reset link
          </button>
        </form>

        <p style={styles.linkText}>
          Remember your password?{" "}
          <Link to="/" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6f8",
    padding: "1rem",
  },
  box: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
    textAlign: "center",
    fontFamily: "system-ui",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  subtext: {
    fontSize: "15px",
    color: "#444",
    marginBottom: "1.5rem",
  },
  success: {
    color: "green",
    marginBottom: "1rem",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  button: {
    backgroundColor: "#0a66ff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.75rem",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },
  linkText: {
    marginTop: "1rem",
    fontSize: "14px",
    color: "#555",
  },
  link: {
    color: "#0a66ff",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default ForgotPassword;
