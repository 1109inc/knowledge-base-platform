import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(res.data.message || "Password updated successfully");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Create a new password</h2>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            New password
            <input
              type="password"
              placeholder="Enter new password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>

          <label style={styles.label}>
            Confirm new password
            <input
              type="password"
              placeholder="Confirm new password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" style={styles.button}>
            Update password
          </button>
        </form>
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
    fontFamily: "system-ui",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  button: {
    marginTop: "1rem",
    backgroundColor: "#0a66ff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "0.75rem",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    width: "fit-content",
    alignSelf: "center",
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: "1rem",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
};

export default ResetPassword;
