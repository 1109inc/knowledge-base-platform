// Import necessary hooks and modules
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Hooks for accessing URL parameters and navigation
import axios from "../api/axios"; // Custom axios instance for API calls

/**
 * Component for editing an existing document.
 * Fetches the document data, allows modification of title, content, and visibility,
 * and handles submission of changes.
 * @returns {JSX.Element} The edit document form.
 */
const EditDocument = () => {
  // Get the document ID from URL parameters
  const { id } = useParams();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State variables for form inputs, error handling, and document data
  const [title, setTitle] = useState(""); // Document title
  const [content, setContent] = useState(""); // Document content
  const [isPublic, setIsPublic] = useState(true); // Document visibility
  const [error, setError] = useState(""); // Error message
  const [document, setDocument] = useState(null); // Stores the fetched document data

  // Get the logged-in user's email from local storage
  const userEmail = localStorage.getItem("userEmail");

  // Determine if the current user has permission to edit the document
  const canEdit =
    document && // Check if document data is loaded
    (document.authorEmail === userEmail || // User is the author
      document.sharedWith?.some(
        (u) => u.email === userEmail && u.access === "edit" // User is shared with edit access
      ));

  // useEffect hook to fetch the document data when the component mounts or ID changes
  useEffect(() => {
    /**
     * Fetches the document data from the server.
     */
    const fetchDoc = async () => {
      try {
        // Make a GET request to fetch the document by ID
        const res = await axios.get(`/documents/${id}`);
        const doc = res.data.document;

        // Set the document data and form input states
        setDocument(doc);
        setTitle(doc.title);
        setContent(doc.content);
        setIsPublic(doc.isPublic);
      } catch (err) {
        // Set an error message if fetching fails
        setError("Failed to load document");
      }
    };

    fetchDoc();
  }, [id]); // Dependency: re-run effect if the document ID changes

  /**
   * Handles form submission to update the document.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors

    try {
      // Send a PUT request to update the document
      await axios.put(`/documents/${id}`, {
        title,
        content,
        isPublic,
      });

      // Navigate to the view document page after successful update
      navigate(`/documents/${id}`);
    } catch (err) {
      // Set an error message if updating fails
      setError("Failed to update document");
    }
  };

  // Conditional rendering based on loading state, errors, and permissions
  if (error && !document) return <p style={{ color: "red" }}>{error}</p>; // Show error if document failed to load
  if (!document) return <p>Loading...</p>; // Show loading message while fetching data
  if (!canEdit) {
    return <p style={{ color: "red" }}>You do not have permission to edit this document.</p>; // Show permission error
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit Document</h2>
      {/* Display error message if any during form submission */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form for editing the document */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem", // Spacing between form elements
          maxWidth: "600px", // Max width of the form
        }}
      >
        {/* Input field for document title */}
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required // Title is required
        />

        {/* Textarea for document content */}
        <textarea
          rows={10}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required // Content is required
        />

        {/* Checkbox to make the document public (only visible to the author) */}
        {document.authorEmail === userEmail && (
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />{" "}
            Make Public
          </label>
        )}

        {/* Submit button to save changes */}
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff", // Button background color
            color: "white", // Button text color
            padding: "0.5rem 1rem", // Button padding
            border: "none", // No border
            borderRadius: "4px", // Rounded corners
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

// Export the EditDocument component
export default EditDocument;
