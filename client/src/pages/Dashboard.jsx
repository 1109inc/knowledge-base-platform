// Import necessary hooks and modules
import { useEffect, useState } from "react";
import axios from "../api/axios"; // Custom axios instance for API calls
import { useNavigate, Link } from "react-router-dom"; // Hooks for navigation and linking

/**
 * Dashboard component.
 * Displays a list of user's documents, allows searching, and provides a link to create new documents.
 * @returns {JSX.Element} The dashboard page.
 */
const Dashboard = () => {
  // State variables for documents, error messages, search term
  const [documents, setDocuments] = useState([]); // Stores the list of documents
  const [error, setError] = useState(""); // Stores error messages
  const [searchTerm, setSearchTerm] = useState(""); // Stores the current search term
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // useEffect hook to fetch documents when the component mounts or search term changes
  useEffect(() => {
    /**
     * Fetches documents from the server.
     * If a search term is present, it fetches documents matching the search term.
     * Otherwise, it fetches all documents for the user.
     */
    const fetchDocuments = async () => {
      try {
        // Construct the URL based on whether a search term is present
        const url = searchTerm
          ? `/documents/search?q=${encodeURIComponent(searchTerm)}` // URL for searching documents
          : "/documents"; // URL for fetching all documents

        // Make a GET request to fetch documents
        const res = await axios.get(url);
        // Update the documents state with the fetched documents
        setDocuments(res.data.documents);
      } catch (err) {
        // Set an error message if fetching documents fails
        setError("Unauthorized or failed to load documents");
        // If the error is an authorization error (401), navigate to the login page
        if (err.response?.status === 401) {
          navigate("/");
        }
      }
    };

    // Call fetchDocuments to load data
    fetchDocuments();
  }, [searchTerm, navigate]); // Dependencies for useEffect: re-run when searchTerm or navigate changes

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Documents</h2>
      {/* Display error message if any */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Top bar containing search input and create document button */}
      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
          style={styles.searchBox}
        />
        {/* Link to the create document page */}
        <Link to="/create">
          <button style={styles.createButton}>+ Create New Document</button>
        </Link>
      </div>

      {/* Conditional rendering: display message if no documents, otherwise display table */}
      {documents.length === 0 ? (
        <p style={styles.noDocs}>No documents found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Privacy</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through the documents array and render a table row for each document */}
            {documents.map((doc) => (
              <tr key={doc._id} style={styles.row}>
                <td style={styles.td}>
                  {/* Link to view the specific document */}
                  <Link to={`/documents/${doc._id}`} style={styles.docLink}>
                    {doc.title}
                  </Link>
                </td>
                <td style={styles.td}>
                  {/* Display document privacy status (Public/Private) */}
                  <span style={styles.privacyBadge(doc.isPublic)}>
                    {doc.isPublic ? "Public" : "Private"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Styles for the Dashboard component
const styles = {
  container: {
    padding: "2rem",
    fontFamily: "system-ui",
    backgroundColor: "#f9fbfd", // Light background color for the page
    minHeight: "100vh",
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
  topBar: {
    display: "flex",
    justifyContent: "space-between", // Space out search box and button
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  searchBox: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "300px", // Fixed width for search box
    fontSize: "16px",
  },
  createButton: {
    backgroundColor: "#0a66ff", // Primary button color
    color: "#fff",
    padding: "0.75rem 1.25rem",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  noDocs: {
    fontStyle: "italic",
    color: "#555", // Muted color for no documents message
  },
  table: {
    width: "100%",
    borderCollapse: "collapse", // Remove default table borders
    backgroundColor: "#fff", // White background for the table
    borderRadius: "6px", // Rounded corners for the table
    overflow: "hidden", // Ensures border radius is applied to content
    boxShadow: "0 0 5px rgba(0,0,0,0.05)", // Subtle shadow for depth
  },
  th: {
    textAlign: "center", // Center header text
    padding: "1rem",
    backgroundColor: "#f1f3f5", // Light grey background for table headers
    fontWeight: "600",
    borderBottom: "1px solid #e0e0e0", // Bottom border for headers
  },
  row: {
    borderBottom: "1px solid #e0e0e0", // Bottom border for table rows
  },
  td: {
    padding: "1rem",
    textAlign: "center", // Center cell text
  },
  docLink: {
    textDecoration: "none",
    color: "#0a66ff", // Link color
    fontWeight: "500",
  },
  // Dynamic styling for the privacy badge based on isPublic status
  privacyBadge: (isPublic) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px", // Pill-shaped badge
    fontSize: "14px",
    fontWeight: "500",
    color: isPublic ? "#0c6" : "#555", // Green for public, grey for private
    backgroundColor: isPublic ? "#e6ffed" : "#eee", // Light green/grey background
  }),
};

// Export the Dashboard component
export default Dashboard;
