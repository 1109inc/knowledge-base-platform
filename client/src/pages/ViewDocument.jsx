// Import necessary hooks and modules
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Hooks for URL parameters and navigation
import axios from "../api/axios"; // Custom axios instance for API calls

/**
 * ViewDocument component.
 * Displays the content of a document, allows editing (if permissioned), deletion (if author),
 * sharing with other users, and comparing different versions of the document.
 * @returns {JSX.Element} The view document page.
 */
const ViewDocument = () => {
  // Get document ID from URL parameters
  const { id } = useParams();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State variables for document data, errors, sharing, and versioning
  const [document, setDocument] = useState(null); // Stores the current document data
  const [error, setError] = useState(""); // Stores general error messages
  const [shareEmail, setShareEmail] = useState(""); // Stores email for sharing
  const [accessType, setAccessType] = useState("view"); // Access type for sharing (view/edit)
  const [shareError, setShareError] = useState(""); // Error messages related to sharing
  const [shareSuccess, setShareSuccess] = useState(""); // Success messages related to sharing
  const [removeMessage, setRemoveMessage] = useState(""); // Messages related to removing user access

  const [versions, setVersions] = useState([]); // Stores document versions for comparison
  const [oldIndex, setOldIndex] = useState(null); // Index of the older version for diff
  const [newIndex, setNewIndex] = useState(null); // Index of the newer version for diff
  const [diff, setDiff] = useState(null); // Stores the diff result between two versions

  // Get logged-in user's email from local storage
  const userEmail = localStorage.getItem("userEmail");

  // Determine if the current user can edit the document
  const canEdit = !!document && ( // Ensure document is loaded
    document.authorEmail === userEmail || // User is the author
    (Array.isArray(document.sharedWith) && // Check if sharedWith is an array
      document.sharedWith.some(
        (u) => u.email?.trim() === userEmail?.trim() && u.access === "edit" // User is shared with edit access
      ))
  );

  /**
   * Handles removing a user's access to the document.
   * @param {string} emailToRemove - The email of the user to remove.
   */
  const handleRemoveAccess = async (emailToRemove) => {
    try {
      // Send DELETE request to remove share access
      await axios.delete(`/documents/${id}/share`, {
        data: { email: emailToRemove },
      });
      // Fetch updated document data
      const res = await axios.get(`/documents/${id}`);
      setDocument(res.data.document);
      setRemoveMessage("User removed successfully!");
      // Clear message after 3 seconds
      setTimeout(() => setRemoveMessage(""), 3000);
    } catch (err) {
      // Handle error (e.g., display a message to the user)
    }
  };

  /**
   * Handles deleting the entire document.
   * Prompts for confirmation before deletion.
   * Only available to the document author.
   */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      // Send DELETE request to delete the document
      await axios.delete(`/documents/${document._id}`);
      alert("Document deleted successfully.");
      // Navigate to dashboard after deletion
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to delete the document.");
    }
  };

  // useEffect hook to fetch document data and versions when component mounts or ID/navigate changes
  useEffect(() => {
    /**
     * Fetches the main document data.
     */
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/documents/${id}`);
        setDocument(res.data.document);
      } catch (err) {
        setError("Document not found or access denied.");
        // If unauthorized, navigate to login
        if (err.response?.status === 401) navigate("/");
      }
    };

    /**
     * Fetches the versions of the document for comparison.
     */
    const fetchVersions = async () => {
      try {
        const res = await axios.get(`/documents/${id}/versions`);
        setVersions(res.data.versions || []); // Ensure versions is an array
      } catch (err) {
        // Handle error (e.g., log or display a message)
      }
    };

    fetchDoc();
    fetchVersions();
  }, [id, navigate]); // Dependencies: id and navigate

  /**
   * Handles sharing the document with another user.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleShare = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Clear previous messages
    setShareError("");
    setShareSuccess("");
    setRemoveMessage("");

    try {
      // Send POST request to share the document
      await axios.post(`/documents/${id}/share`, {
        email: shareEmail,
        access: accessType,
      });
      setShareSuccess("User shared successfully!");
      // Reset share form fields
      setShareEmail("");
      setAccessType("view");
      // Fetch updated document data to reflect sharing changes
      const doc = await axios.get(`/documents/${id}`);
      setDocument(doc.data.document);
    } catch (err) {
      setShareError("Failed to share document.");
    }
  };

  // Inline styles (can be moved to a separate CSS file or styled-components for better organization)
  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    backgroundColor: "#2563eb", // Blue button
    color: "white",
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const containerStyle = {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
  };

  // Conditional rendering for error or loading states
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!document) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={containerStyle}>
      {/* Document Title */}
      <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem" }}>{document.title}</h2>
      {/* Document Content (rendered as HTML) */}
      <div dangerouslySetInnerHTML={{ __html: document.content }} style={{ whiteSpace: "pre-wrap", lineHeight: "1.5", marginBottom: "1rem" }} />
      {/* Document Visibility */}
      <p><strong>Visibility:</strong> {document.isPublic ? "Public" : "Private"}</p>

      {/* Edit and Delete Buttons (visible if user has edit permission) */}
      {canEdit && (
        <div style={{ marginTop: "1rem" }}>
          {/* Edit Button */}
          <button
            style={buttonStyle}
            onClick={() => navigate(`/documents/${document._id}/edit`)}
          >
            ✏️ Edit Document
          </button>

          {/* Delete Button (only for document author) */}
          {document.authorEmail === userEmail && (
            <button
              onClick={handleDelete}
              style={{
                ...buttonStyle,
                marginLeft: "10px",
                backgroundColor: "#dc3545", // Red button for delete
              }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}

      {/* Version Comparison Section (visible if more than one version exists) */}
      {versions.length > 1 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Compare Versions</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {/* Select for older version */}
            <select onChange={(e) => setOldIndex(parseInt(e.target.value))} defaultValue="" style={inputStyle}>
              <option disabled value="">Version 1</option>
              {versions.map((v, idx) => (
                <option key={idx} value={idx}>
                  {idx} — {v.editor} @ {new Date(v.editedAt).toLocaleString()}
                </option>
              ))}
            </select>

            {/* Select for newer version */}
            <select onChange={(e) => setNewIndex(parseInt(e.target.value))} defaultValue="" style={inputStyle}>
              <option disabled value="">Version 2</option>
              {versions.map((v, idx) => (
                <option key={idx} value={idx}>
                  {idx} — {v.editor} @ {new Date(v.editedAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Compare Button */}
          <button
            onClick={async () => {
              if (oldIndex !== null && newIndex !== null) {
                // Fetch diff data
                const res = await axios.get(`/documents/${id}/diff?old=${oldIndex}&new=${newIndex}`);
                setDiff(res.data);
              }
            }}
            disabled={oldIndex === null || newIndex === null} // Disable if versions not selected
            style={{ ...buttonStyle, marginTop: "1rem" }}
          >
            Compare
          </button>
        </div>
      )}

      {/* Display Diff Results */}
      {diff && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }}>
          <h4 style={{ fontWeight: "bold" }}>Title Diff:</h4>
          <p><strong>Version 1:</strong> {diff.titleDiff.from}</p>
          <p><strong>Version 2:</strong> {diff.titleDiff.to}</p>
          <h4 style={{ fontWeight: "bold", marginTop: "1rem" }}>Content Diff:</h4>
          <p><strong>Version 1:</strong></p>
          <div dangerouslySetInnerHTML={{ __html: diff.contentDiff.from }} />
          <p><strong>Version 2:</strong></p>
          <div dangerouslySetInnerHTML={{ __html: diff.contentDiff.to }} />
        </div>
      )}

      {/* Share Document Section (only for document author) */}
      {document.authorEmail === userEmail && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Share Document</h3>
          {/* Share Form */}
          <form onSubmit={handleShare} autoComplete="off">
            <input
              type="email"
              placeholder="Enter user email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              required
              style={inputStyle}
              autoComplete="off" // Disable browser autocomplete for email
            />
            {/* Access Type Select */}
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              style={inputStyle}
              autoComplete="off"
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            {/* Share Button */}
            <button type="submit" style={buttonStyle}>Share</button>
            {/* Share Status Messages */}
            {shareError && <p style={{ color: "red", marginTop: "0.5rem" }}>{shareError}</p>}
            {shareSuccess && <p style={{ color: "green", marginTop: "0.5rem" }}>{shareSuccess}</p>}
            {removeMessage && <p style={{ color: "green", marginTop: "0.5rem" }}>{removeMessage}</p>}
          </form>

          {/* List of Shared Users (if any and user can edit) */}
          {canEdit && document.sharedWith?.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h4>Shared With:</h4>
              <ul style={{ paddingLeft: "1rem" }}>
                {document.sharedWith.map((user, idx) => (
                  <li key={idx} style={{ marginBottom: "0.5rem" }}>
                    {user.email} — {user.access}
                    {/* Remove Access Button */}
                    <button
                      onClick={() => handleRemoveAccess(user.email)}
                      style={{
                        marginLeft: "1rem",
                        padding: "5px 10px",
                        border: "none",
                        backgroundColor: "#eee", // Light grey button
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export the ViewDocument component
export default ViewDocument;
