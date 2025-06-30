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

  // ✅ 1. Version compare state
  const [versions, setVersions] = useState([]);
  const [oldIndex, setOldIndex] = useState(null);
  const [newIndex, setNewIndex] = useState(null);
  const [diff, setDiff] = useState(null);

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

    // ✅ 2. Fetch Versions on Load
    const fetchVersions = async () => {
      try {
        const res = await axios.get(`/documents/${id}/versions`);
        setVersions(res.data.versions || []);
      } catch (err) {
        console.error("Failed to fetch versions", err);
      }
    };

    fetchVersions();
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

      {/* ✅ 3. Version Compare UI */}
      {versions.length > 1 && (
        <div style={{ marginTop: "2rem" }}>
          <h4>Compare Versions</h4>

          <label>Version 1: </label>
          <select onChange={(e) => setOldIndex(parseInt(e.target.value))} defaultValue="">
            <option disabled value="">
              Select
            </option>
            {versions.map((v, idx) => (
              <option key={idx} value={idx}>
                {idx} — {v.editor} @ {new Date(v.editedAt).toLocaleString()}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: "1rem" }}>Version 2: </label>
          <select onChange={(e) => setNewIndex(parseInt(e.target.value))} defaultValue="">
            <option disabled value="">
              Select
            </option>
            {versions.map((v, idx) => (
              <option key={idx} value={idx}>
                {idx} — {v.editor} @ {new Date(v.editedAt).toLocaleString()}
              </option>
            ))}
          </select>

          <button
            onClick={async () => {
              if (oldIndex !== null && newIndex !== null) {
                console.log("Comparing versions", oldIndex, newIndex);
                const res = await axios.get(
                  `/documents/${id}/diff?old=${oldIndex}&new=${newIndex}`
                );
                setDiff(res.data);
              }
            }}
            disabled={oldIndex === null || newIndex === null}
            style={{ marginLeft: "1rem" }}
          >
            Compare
          </button>
        </div>
      )}

      {/* ✅ 4. Show Diff Output */}
      {diff && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #ccc",
          }}
        >
          <h4>Title Diff:</h4>
          <p>
            <strong>Version 1:</strong> {diff.titleDiff.from}
          </p>
          <p>
            <strong>Version 2:</strong> {diff.titleDiff.to}
          </p>

          <h4>Content Diff:</h4>
          <p>
            <strong>Version 1:</strong>
          </p>
          <div dangerouslySetInnerHTML={{ __html: diff.contentDiff.from }} />
          <p>
            <strong>Version 2:</strong>
          </p>
          <div dangerouslySetInnerHTML={{ __html: diff.contentDiff.to }} />
        </div>
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
