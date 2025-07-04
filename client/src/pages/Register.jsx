// Import necessary hooks and modules
import { useState } from "react";
import axios from "../api/axios"; // Custom axios instance for API calls
import { useNavigate, Link } from "react-router-dom"; // Hooks for navigation and linking

/**
 * Register component.
 * Provides a form for new users to register with their email and password.
 * Handles form submission, API request for registration, and navigation upon successful registration.
 * @returns {JSX.Element} The registration page.
 */
const Register = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State for form data (email and password)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // State for error messages
  const [error, setError] = useState("");

  /**
   * Handles changes in form input fields.
   * Updates the formData state with the new value.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value // Update the corresponding field in formData
    }));
  };

  /**
   * Handles form submission for registration.
   * Sends a POST request to the register endpoint with form data.
   * Stores the authentication token and user email in local storage upon success.
   * Navigates to the dashboard upon successful registration.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous error messages

    try {
      // Send POST request to register endpoint
      const res = await axios.post("/auth/register", formData);
      // Store token and user email in local storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", res.data.user.email);
      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (err) {
      // Set error message if registration fails, using server response or a default message
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create your account</h2>
        {/* Display error message if any */}
        {error && <p style={styles.error}>{error}</p>}
        {/* Registration form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email" // Name attribute matches formData key
            placeholder="Email"
            value={formData.email}
            onChange={handleChange} // Handle input changes
            required // Email is required
            style={styles.input}
          />
          <input
            type="password"
            name="password" // Name attribute matches formData key
            placeholder="Password"
            value={formData.password}
            onChange={handleChange} // Handle input changes
            required // Password is required
            style={styles.input}
          />
          {/* Submit button for registration */}
          <button type="submit" style={styles.button}>Register</button>
        </form>
        {/* Link to login page for existing users */}
        <p style={styles.footer}>
          Already have an account? <Link to="/" style={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

// Styles for the Register component
const styles = {
  container: {
    display: "flex",
    height: "100vh", // Full viewport height
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    background: "#f9fafb", // Light background color for the page
  },
  card: {
    padding: "2rem", // Padding inside the card
    width: "100%",
    maxWidth: "400px", // Max width of the card
    background: "#fff", // White background for the card
    boxShadow: "0 0 10px rgba(0,0,0,0.05)", // Subtle shadow
    borderRadius: "8px", // Rounded corners
    textAlign: "center", // Center text content
  },
  heading: {
    marginBottom: "1.5rem", // Space below the heading
    fontSize: "1.5rem", // Font size for the heading
  },
  form: {
    display: "flex",
    flexDirection: "column", // Stack form elements vertically
    gap: "1rem", // Space between form elements
  },
  input: {
    padding: "0.75rem 1rem", // Padding inside input fields
    fontSize: "1rem", // Font size for input text
    border: "1px solid #ccc", // Light border for input fields
    borderRadius: "5px", // Rounded corners for input fields
    background: "#f1f5f9", // Light background for input fields
  },
  button: {
    padding: "0.75rem", // Padding inside the button
    background: "#1d4ed8", // Button background color (blue)
    color: "#fff", // White text color
    fontWeight: "bold", // Bold text
    border: "none", // No border
    borderRadius: "5px", // Rounded corners
    cursor: "pointer", // Pointer cursor on hover
  },
  error: {
    color: "red", // Red color for error messages
    marginBottom: "1rem", // Space below error messages
  },
  footer: {
    marginTop: "1rem", // Space above the footer text
    fontSize: "0.9rem", // Font size for footer text
  },
  link: {
    color: "#1d4ed8", // Link color (blue)
    textDecoration: "underline", // Underline for the link
  }
};

// Export the Register component
export default Register;
