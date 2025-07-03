import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", res.data.user.email);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Welcome back</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />

          <Link to="/forgot-password" style={styles.linkSmall}>
            Forgot password?
          </Link>

          <button type="submit" style={styles.button}>
            Log in
          </button>

          <p style={styles.linkText}>
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
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
    backgroundColor: "#f8f9fa",
  },
  formBox: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#0a66ff",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  linkText: {
    fontSize: "14px",
    textAlign: "center",
    marginTop: "1rem",
  },
  linkSmall: {
    fontSize: "13px",
    textAlign: "right",
    textDecoration: "none",
    color: "#0077cc",
    marginBottom: "-0.5rem",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
};

export default Login;
