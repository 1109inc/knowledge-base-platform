// Import necessary hooks and modules
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Hooks for accessing URL parameters and navigation
import axios from "../api/axios"; // Custom axios instance for API calls

/**
 * ResetPassword component.
 * Allows users to reset their password using a token received via email.
 * Provides a form to enter and confirm the new password.
 * @returns {JSX.Element} The reset password page.
 */
const ResetPassword = () => {
  // Get the reset token from URL parameters
  const { token } = useParams();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State variables for new password, confirm password, success message, and error message
  const [newPassword, setNewPassword] = useState(""); // Stores the new password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Stores the confirmed new password input
  const [message, setMessage] = useState(""); // Stores success messages
  const [error, setError] = useState(""); // Stores error messages

  /**
   * Handles form submission for resetting the password.
   * Validates that the new password and confirm password fields match.
   * Sends a POST request to the reset-password endpoint with the token and new password.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(""); // Clear previous success messages
    setError(""); // Clear previous error messages

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return; // Stop submission if passwords don't match
    }

    try {
      // Send POST request to reset password with the token and new password
      const res = await axios.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      // Set success message from server response or a default message
      setMessage(res.data.message || "Password updated successfully");
      // Navigate to the login page after a delay
      setTimeout(() => navigate("/"), 2000); // 2-second delay before redirecting
    } catch (err) {
      // Set error message from server response or a default message if reset fails
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>Create a new password</h2>

        {/* Display success message if present */}
        {message && <p style={styles.success}>{message}</p>}
        {/* Display error message if present */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Form for resetting the password */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            New password
            <input
              type="password"
              placeholder="Enter new password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} // Update newPassword state
              required // New password is required
            />
          </label>

          <label style={styles.label}>
            Confirm new password
            <input
              type="password"
              placeholder="Confirm new password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
              required // Confirm password is required
            />
          </label>

          {/* Submit button to update the password */}
          <button type="submit" style={styles.button}>
            Update password
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles for the ResetPassword component
const styles = {
  container: {
    minHeight: "100vh", // Full viewport height
    display: "flex",
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    backgroundColor: "#f5f6f8", // Light grey background
    padding: "1rem", // Padding around the container
  },
  box: {
    backgroundColor: "#fff", // White background for the form box
    padding: "2rem", // Padding inside the box
    borderRadius: "8px", // Rounded corners
    width: "100%",
    maxWidth: "480px", // Max width of the box
    boxShadow: "0 0 10px rgba(0,0,0,0.05)", // Subtle shadow
    fontFamily: "system-ui", // System font
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "center", // Center align heading
    marginBottom: "1.5rem", // Space below heading
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    flexDirection: "column", // Stack label and input vertically
    gap: "0.5rem", // Space between label and input
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc", // Light grey border
    fontSize: "15px",
  },
  button: {
    marginTop: "1rem", // Space above the button
    backgroundColor: "#0a66ff", // Primary button color
    color: "#fff", // White text color
    border: "none", // No border
    borderRadius: "6px",
    padding: "0.75rem",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer", // Pointer cursor on hover
    width: "fit-content", // Button width fits its content
    alignSelf: "center", // Center button horizontally within the form
  },
  success: {
    color: "green", // Green color for success messages
    textAlign: "center",
    marginBottom: "1rem",
  },
  error: {
    color: "red", // Red color for error messages
    textAlign: "center",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column", // Stack form elements vertically
    gap: "1.2rem", // Space between form elements
  },
};

// Export the ResetPassword component
export default ResetPassword;
