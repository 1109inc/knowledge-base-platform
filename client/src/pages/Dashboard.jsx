import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get("/documents");
        console.log("Documents API Response:", res.data);
        setDocuments(res.data.documents); // ✅ FIXED
      } catch (err) {
        console.error(err);
        setError("Unauthorized or failed to load documents");
        if (err.response?.status === 401) {
          navigate("/"); // redirect to login if token invalid
        }
      }
    };

    fetchDocs();
  }, [navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Documents</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc._id}>
              <strong>{doc.title}</strong> — {doc.isPublic ? "Public" : "Private"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
