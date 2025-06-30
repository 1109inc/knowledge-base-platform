import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("userEmail"); // from login

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/documents/${id}`);
        setDocument(res.data.document);
      } catch (err) {
        console.error(err);
        setError("Document not found or access denied.");
        if (err.response?.status === 401) {
          navigate("/"); // force login if token invalid
        }
      }
    };

    fetchDoc();
  }, [id, navigate]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!document) return <p>Loading...</p>;

  // Debug logs
  // console.log("📦 document:", document);
  // console.log("📧 userEmail:", localStorage.getItem("userEmail"));
  // console.log("👥 authorEmail:", document.authorEmail);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{document.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: document.content }} />
      <p><strong>Visibility:</strong> {document.isPublic ? "Public" : "Private"}</p>
      {document.authorEmail === userEmail && (
        <button onClick={() => navigate(`/documents/${document._id}/edit`)}>
          ✏️ Edit Document
        </button>
      )}
    </div>
  );
};

export default ViewDocument;
