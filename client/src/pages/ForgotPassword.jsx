// Import necessary hooks and modules
import { useState } from "react";
import axios from "../api/axios"; // Custom axios instance for API calls
import { Link } from "react-router-dom"; // Component for navigation links

/**
 * ForgotPassword component.
 * Provides a form for users to submit their email address to receive a password reset link.
 * @returns {JSX.Element} The forgot password page.
 */
const ForgotPassword = () => {
  // State variables for email input, success message, and error message
  const [email, setEmail] = useState(""); // Stores the email input by the user
  const [message, setMessage] = useState(""); // Stores success messages (e.g., "Reset link sent!")
  const [error, setError] = useState(""); // Stores error messages

  /**
   * Handles form submission for requesting a password reset link.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage(""); // Clear any previous success messages
    setError(""); // Clear any previous error messages

    try {
      // Send a POST request to the forgot-password endpoint with the user's email
      const res = await axios.post("/auth/forgot-password", { email });
      // Set a success message based on the server's response or a default message
      setMessage(res.data.message || "Reset link sent!");
    } catch (err) {
      // Set an error message if the request fails, using the server's error message or a default one
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

        {/* Display success message if present */}
        {message && <p style={styles.success}>{message}</p>}
        {/* Display error message if present */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Form for submitting the email address */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state on input change
            required // Email input is required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Send reset link
          </button>
        </form>

        {/* Link to navigate back to the sign-in page */}
        <p style={styles.linkText}>
          Remember your password?{" "}
          <Link to="/" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

// Styles for the ForgotPassword component
const styles = {
  container: {
    minHeight: "100vh", // Ensure the container takes at least the full viewport height
    display: "flex",
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    backgroundColor: "#f5f6f8", // Light grey background for the page
    padding: "1rem", // Padding around the container
  },
  box: {
    backgroundColor: "#fff", // White background for the form box
    padding: "2rem", // Padding inside the box
    borderRadius: "8px", // Rounded corners for the box
    width: "100%",
    maxWidth: "480px", // Maximum width of the box
    boxShadow: "0 0 10px rgba(0,0,0,0.05)", // Subtle shadow for the box
    textAlign: "center", // Center text content within the box
    fontFamily: "system-ui", // System font stack
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  subtext: {
    fontSize: "15px",
    color: "#444", // Dark grey color for subtext
    marginBottom: "1.5rem",
  },
  success: {
    color: "green", // Green color for success messages
    marginBottom: "1rem",
  },
  error: {
    color: "red", // Red color for error messages
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column", // Stack form elements vertically
    gap: "1rem", // Space between form elements
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc", // Light grey border for input fields
    fontSize: "15px",
  },
  button: {
    backgroundColor: "#0a66ff", // Primary button color
    color: "#fff", // White text color for the button
    border: "none",
    borderRadius: "6px",
    padding: "0.75rem",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer", // Pointer cursor on hover
  },
  linkText: {
    marginTop: "1rem",
    fontSize: "14px",
    color: "#555", // Medium grey color for link text
  },
  link: {
    color: "#0a66ff", // Link color
    textDecoration: "none", // Remove underline from link
    fontWeight: "500",
  },
};

// Export the ForgotPassword component
export default ForgotPassword;
