import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const url = searchTerm
          ? `/documents/search?q=${encodeURIComponent(searchTerm)}`
          : "/documents";

        const res = await axios.get(url);
        setDocuments(res.data.documents);
      } catch (err) {
        console.error("Failed to load documents", err);
        setError("Unauthorized or failed to load documents");
        if (err.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchDocuments();
  }, [searchTerm, navigate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Documents</h2>
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBox}
        />
        <Link to="/create">
          <button style={styles.createButton}>+ Create New Document</button>
        </Link>
      </div>

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
            {documents.map((doc) => (
              <tr key={doc._id} style={styles.row}>
                <td style={styles.td}>
                  <Link to={`/documents/${doc._id}`} style={styles.docLink}>
                    {doc.title}
                  </Link>
                </td>
                <td style={styles.td}>
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

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "system-ui",
    backgroundColor: "#f9fbfd",
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  searchBox: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "300px",
    fontSize: "16px",
  },
  createButton: {
    backgroundColor: "#0a66ff",
    color: "#fff",
    padding: "0.75rem 1.25rem",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  noDocs: {
    fontStyle: "italic",
    color: "#555",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 0 5px rgba(0,0,0,0.05)",
  },
  th: {
    textAlign: "center", // Center header text
    padding: "1rem",
    backgroundColor: "#f1f3f5",
    fontWeight: "600",
    borderBottom: "1px solid #e0e0e0",
  },
  row: {
    borderBottom: "1px solid #e0e0e0",
  },
  td: {
    padding: "1rem",
    textAlign: "center", // Center cell text
  },
  docLink: {
    textDecoration: "none",
    color: "#0a66ff",
    fontWeight: "500",
  },
  privacyBadge: (isPublic) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    color: isPublic ? "#0c6" : "#555",
    backgroundColor: isPublic ? "#e6ffed" : "#eee",
  }),
};

export default Dashboard;
