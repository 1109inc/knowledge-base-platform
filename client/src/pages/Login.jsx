// Import necessary hooks and modules
import { useState } from "react";
import axios from "../api/axios"; // Custom axios instance for API calls
import { useNavigate, Link } from "react-router-dom"; // Hooks for navigation and linking

/**
 * Login component.
 * Provides a form for users to log in with their email and password.
 * Handles form submission, API request for login, and navigation upon successful login.
 * @returns {JSX.Element} The login page.
 */
const Login = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // State for form data (email and password)
  const [formData, setFormData] = useState({ email: "", password: "" });
  // State for error messages
  const [error, setError] = useState("");

  /**
   * Handles changes in form input fields.
   * Updates the formData state with the new value.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Handles form submission for logging in.
   * Sends a POST request to the login endpoint with form data.
   * Stores the authentication token and user email in local storage upon success.
   * Navigates to the dashboard upon successful login.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous error messages

    try {
      // Send POST request to login endpoint
      const res = await axios.post("/auth/login", formData);
      // Store token and user email in local storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", res.data.user.email);
      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (err) {
      // Set error message if login fails
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Welcome back</h2>
        {/* Display error message if any */}
        {error && <p style={styles.error}>{error}</p>}
        {/* Login form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email" // Name attribute matches formData key
            value={formData.email}
            placeholder="Email"
            onChange={handleChange} // Handle input changes
            required // Email is required
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password" // Name attribute matches formData key
            value={formData.password}
            placeholder="Password"
            onChange={handleChange} // Handle input changes
            required // Password is required
            style={styles.input}
          />

          {/* Link to forgot password page */}
          <Link to="/forgot-password" style={styles.linkSmall}>
            Forgot password?
          </Link>

          {/* Submit button for login */}
          <button type="submit" style={styles.button}>
            Log in
          </button>

          {/* Link to registration page */}
          <p style={styles.linkText}>
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

// Styles for the Login component
const styles = {
  container: {
    minHeight: "100vh", // Full viewport height
    display: "flex",
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    backgroundColor: "#f8f9fa", // Light background color
  },
  formBox: {
    background: "#fff", // White background for the form container
    padding: "2.5rem", // Padding inside the form container
    borderRadius: "8px", // Rounded corners
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)", // Subtle shadow
    width: "100%",
    maxWidth: "400px", // Max width of the form container
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem", // Space below the title
  },
  form: {
    display: "flex",
    flexDirection: "column", // Stack form elements vertically
    gap: "1rem", // Space between form elements
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold", // Bold label text
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ddd", // Light border for input fields
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#0a66ff", // Primary button color
    color: "#fff", // White text color
    fontWeight: "bold",
    border: "none", // No border
    borderRadius: "6px",
    cursor: "pointer", // Pointer cursor on hover
  },
  linkText: {
    fontSize: "14px",
    textAlign: "center", // Center align text
    marginTop: "1rem", // Space above the link text
  },
  linkSmall: {
    fontSize: "13px",
    textAlign: "right", // Align link to the right
    textDecoration: "none", // No underline for the link
    color: "#0077cc", // Link color
    marginBottom: "-0.5rem", // Adjust margin for positioning
  },
  error: {
    color: "red", // Red color for error messages
    fontSize: "14px",
    textAlign: "center", // Center align error message
  },
};

// Export the Login component
export default Login;
