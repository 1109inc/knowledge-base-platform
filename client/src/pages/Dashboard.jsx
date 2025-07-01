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
          ? `/search?q=${encodeURIComponent(searchTerm)}`
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
      <div style={styles.header}>
        <h2 style={styles.heading}>My Documents</h2>
        <button style={styles.createBtn} onClick={() => navigate("/create")}>
          Create New Document
        </button>
      </div>

      {/* Center the search bar */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <input
          type="text"
          placeholder="Search documents"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.search}
        />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "50%" }}>Title</th>
              <th style={{ ...styles.th, width: "50%" }}>Privacy</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td style={{ ...styles.td, width: "50%" }}>
                  <Link to={`/documents/${doc._id}`} style={styles.link}>
                    {doc.title}
                  </Link>
                </td>
                <td style={{ ...styles.td, width: "50%" }}>
                  <span style={styles.privacy}>
                    {doc.isPublic ? "Public" : "Private"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem"
  },
  heading: {
    fontSize: "2rem"
  },
  createBtn: {
    backgroundColor: "#e5e7eb",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500"
  },
  search: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#f1f5f9",
    marginBottom: "1rem"
  },
  error: {
    color: "red",
    marginBottom: "1rem"
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "8px",
    border: "1px solid #e5e7eb"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed" // Add this line
  },
  th: {
    textAlign: "center", // Center header text
    padding: "1rem",
    backgroundColor: "#f9fafb",
    fontWeight: "bold",
    borderBottom: "1px solid #e5e7eb"
  },
  td: {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center" // Center cell text
  },
  link: {
    textDecoration: "none",
    color: "#1f2937",
    fontWeight: "500"
  },
  privacy: {
    backgroundColor: "#e5e7eb",
    borderRadius: "6px",
    padding: "0.4rem 0.8rem",
    fontSize: "0.9rem"
  }
};

export default Dashboard;
