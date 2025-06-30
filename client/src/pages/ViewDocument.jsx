import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ViewDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [accessType, setAccessType] = useState("view");
  const [shareError, setShareError] = useState("");
  const [shareSuccess, setShareSuccess] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  const canEdit =
    document &&
    (document.authorEmail === userEmail ||
      (document.sharedWith &&
        document.sharedWith.some(
          (u) => u.email === userEmail && u.access === "edit"
        )));

  const handleRemoveAccess = async (emailToRemove) => {
    try {
      await axios.delete(`/documents/${id}/share`, {
        data: { email: emailToRemove },
      });

      // Refresh the document
      const res = await axios.get(`/documents/${id}`);
      setDocument(res.data.document);
    } catch (err) {
      console.error("Remove access failed", err);
    }
  };

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

  const handleShare = async (e) => {
    e.preventDefault();
    setShareError("");
    setShareSuccess("");

    try {
      const res = await axios.post(`/documents/${id}/share`, {
        email: shareEmail,
        access: accessType,
      });
      setShareSuccess("User shared successfully!");
      setShareEmail("");
    } catch (err) {
      console.error(err);
      setShareError("Failed to share document.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!document) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{document.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: document.content }} />
      <p>
        <strong>Visibility:</strong> {document.isPublic ? "Public" : "Private"}
      </p>
      {canEdit && (
        <button onClick={() => navigate(`/documents/${document._id}/edit`)}>
          ✏️ Edit Document
        </button>
      )}
      {document.authorEmail === userEmail && (
        <div style={{ marginTop: "2rem" }}>
          <h3>🔗 Share Document</h3>
          <form onSubmit={handleShare}>
            <input
              type="email"
              placeholder="Enter user email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              required
            />
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            <button type="submit">Share</button>
          </form>
          {shareError && <p style={{ color: "red" }}>{shareError}</p>}
          {shareSuccess && <p style={{ color: "green" }}>{shareSuccess}</p>}

          {canEdit && document.sharedWith && document.sharedWith.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h4>Shared With:</h4>
              <ul>
                {document.sharedWith.map((user, idx) => (
                  <li key={idx}>
                    {user.email} — {user.access}
                    <button
                      onClick={() => handleRemoveAccess(user.email)}
                      style={{ marginLeft: "1rem" }}
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

export default ViewDocument;
