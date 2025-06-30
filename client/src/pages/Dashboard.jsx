import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 🧠 Step 1
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const url = searchTerm
          ? `/documents/search?q=${encodeURIComponent(searchTerm)}`
          : "/documents";

        // Debug logs
        console.log("📤 Sending request to:", url);
        console.log("🔐 Token in localStorage:", localStorage.getItem("token"));

        const res = await axios.get(url);
        setDocuments(res.data.documents);
      } catch (err) {
        console.error("Failed to load documents", err);
        setError("Unauthorized or failed to load documents");
        if (err.response?.status === 401) {
          navigate("/"); // redirect to login if token invalid
        }
      }
    };

    fetchDocuments();
  }, [searchTerm, navigate]); // 🚀 Step 3

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Documents</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Link to="/create">
        <button style={{ marginBottom: "1rem" }}>+ Create New Document</button>
      </Link>

      {/* 🧩 Step 2: Search Input */}
      <input
        type="text"
        placeholder="Search documents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "300px" }}
      />

      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc._id}>
              <Link to={`/documents/${doc._id}`}>
                <strong>{doc.title}</strong>
              </Link>{" "}
              — {doc.isPublic ? "Public" : "Private"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
