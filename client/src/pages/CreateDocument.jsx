// Import necessary hooks and modules
import { useState } from "react";
import axios from "../api/axios"; // Custom axios instance for API calls
import { useNavigate } from "react-router-dom"; // Hook for navigation

/**
 * Component for creating a new document.
 * Allows users to input a title, content, and set the document's visibility (public/private).
 * @returns {JSX.Element} The create document form.
 */
const CreateDocument = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State variables for form inputs and error handling
  const [title, setTitle] = useState(""); // Document title
  const [content, setContent] = useState(""); // Document content
  const [isPublic, setIsPublic] = useState(true); // Document visibility (true for public, false for private)
  const [error, setError] = useState(""); // Error message

  /**
   * Handles form submission to create a new document.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any previous errors

    try {
      // Send a POST request to create the document
      await axios.post("/documents", {
        title,
        content,
        isPublic,
      });
      // Navigate to the dashboard after successful creation
      navigate("/dashboard");
    } catch (err) {
      // Set an error message if document creation fails
      setError("Failed to create document.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>New document</h2>
      {/* Display error message if any */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Form for creating a new document */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Input field for document title */}
        <input
          type="text"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required // Title is required
        />

        {/* Toggle switch for document visibility */}
        <div style={styles.toggleWrapper}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={styles.toggleInput}
            />
            <span style={styles.toggleText}>{isPublic ? "Public" : "Private"}</span>
          </label>
        </div>

        {/* Textarea for document content */}
        <textarea
          rows={10}
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
          required // Content is required
        />

        {/* Submit button to save the document */}
        <button type="submit" style={styles.button}>Save</button>
      </form>
    </div>
  );
};

// Styles for the CreateDocument component
const styles = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
    margin: "auto",
    fontFamily: "system-ui",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "1.5rem",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
  },
  textarea: {
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
    resize: "vertical",
    minHeight: "200px",
  },
  button: {
    backgroundColor: "#0a66ff",
    color: "#fff",
    padding: "0.75rem 1.25rem",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  toggleWrapper: {
    display: "flex",
    alignItems: "center",
  },
  toggleLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  toggleInput: {
    transform: "scale(1.4)", // Makes the checkbox slightly larger
    cursor: "pointer",
  },
  toggleText: {
    fontSize: "15px",
    color: "#333",
  },
};

// Export the CreateDocument component
export default CreateDocument;
