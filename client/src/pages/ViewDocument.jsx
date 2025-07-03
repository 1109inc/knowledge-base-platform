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
  const [removeMessage, setRemoveMessage] = useState("");

  const [versions, setVersions] = useState([]);
  const [oldIndex, setOldIndex] = useState(null);
  const [newIndex, setNewIndex] = useState(null);
  const [diff, setDiff] = useState(null);

  const userEmail = localStorage.getItem("userEmail");

  const canEdit = !!document && (
  document.authorEmail === userEmail ||
  (Array.isArray(document.sharedWith) &&
    document.sharedWith.some(
      (u) => u.email?.trim() === userEmail?.trim() && u.access === "edit"
    ))
);

  const handleRemoveAccess = async (emailToRemove) => {
    try {
      await axios.delete(`/documents/${id}/share`, {
        data: { email: emailToRemove },
      });
      const res = await axios.get(`/documents/${id}`);
      setDocument(res.data.document);
      setRemoveMessage("User removed successfully!");
      setTimeout(() => setRemoveMessage(""), 3000);
    } catch (err) {
      console.error("Remove access failed", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await axios.delete(`/documents/${document._id}`);
      alert("Document deleted successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete the document.");
    }
  };

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/documents/${id}`);
        setDocument(res.data.document);
      } catch (err) {
        setError("Document not found or access denied.");
        if (err.response?.status === 401) navigate("/");
      }
    };

    const fetchVersions = async () => {
      try {
        const res = await axios.get(`/documents/${id}/versions`);
        setVersions(res.data.versions || []);
      } catch (err) {
        console.error("Failed to fetch versions", err);
      }
    };

    fetchDoc();
    fetchVersions();
  }, [id, navigate]);

  const handleShare = async (e) => {
    e.preventDefault();
    setShareError("");
    setShareSuccess("");
    setRemoveMessage("");

    try {
      const res = await axios.post(`/documents/${id}/share`, {
        email: shareEmail,
        access: accessType,
      });
      setShareSuccess("User shared successfully!");
      setShareEmail("");
      setAccessType("view");
      const doc = await axios.get(`/documents/${id}`);
      setDocument(doc.data.document);
    } catch (err) {
      setShareError("Failed to share document.");
    }
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    width: "100%",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
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

  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  if (!document) return <p style={{ textAlign: "center" }}>Loading...</p>;
  
  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem" }}>{document.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: document.content }} style={{ whiteSpace: "pre-wrap", lineHeight: "1.5", marginBottom: "1rem" }} />
      <p><strong>Visibility:</strong> {document.isPublic ? "Public" : "Private"}</p>
      {console.log("canEdit:", canEdit)}
      {canEdit && (
  <div style={{ marginTop: "1rem" }}>
    <button
      style={buttonStyle}
      onClick={() => navigate(`/documents/${document._id}/edit`)}
    >
      ✏️ Edit Document
    </button>

    {document.authorEmail === userEmail && (
      <button
        onClick={handleDelete}
        style={{
          ...buttonStyle,
          marginLeft: "10px",
          backgroundColor: "#dc3545",
        }}
      >
        🗑️ Delete
      </button>
    )}
  </div>
)}


      {versions.length > 1 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Compare Versions</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <select onChange={(e) => setOldIndex(parseInt(e.target.value))} defaultValue="" style={inputStyle}>
              <option disabled value="">Version 1</option>
              {versions.map((v, idx) => (
                <option key={idx} value={idx}>
                  {idx} — {v.editor} @ {new Date(v.editedAt).toLocaleString()}
                </option>
              ))}
            </select>

            <select onChange={(e) => setNewIndex(parseInt(e.target.value))} defaultValue="" style={inputStyle}>
              <option disabled value="">Version 2</option>
              {versions.map((v, idx) => (
                <option key={idx} value={idx}>
                  {idx} — {v.editor} @ {new Date(v.editedAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={async () => {
              if (oldIndex !== null && newIndex !== null) {
                const res = await axios.get(`/documents/${id}/diff?old=${oldIndex}&new=${newIndex}`);
                setDiff(res.data);
              }
            }}
            disabled={oldIndex === null || newIndex === null}
            style={{ ...buttonStyle, marginTop: "1rem" }}
          >
            Compare
          </button>
        </div>
      )}

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

      {document.authorEmail === userEmail && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>Share Document</h3>
          <form onSubmit={handleShare} autoComplete="off">
            <input
              type="email"
              placeholder="Enter user email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              required
              style={inputStyle}
              autoComplete="off"
            />
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              style={inputStyle}
              autoComplete="off"
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            <button type="submit" style={buttonStyle}>Share</button>
            {shareError && <p style={{ color: "red", marginTop: "0.5rem" }}>{shareError}</p>}
            {shareSuccess && <p style={{ color: "green", marginTop: "0.5rem" }}>{shareSuccess}</p>}
            {removeMessage && <p style={{ color: "green", marginTop: "0.5rem" }}>{removeMessage}</p>}
          </form>

          {canEdit && document.sharedWith?.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h4>Shared With:</h4>
              <ul style={{ paddingLeft: "1rem" }}>
                {document.sharedWith.map((user, idx) => (
                  <li key={idx} style={{ marginBottom: "0.5rem" }}>
                    {user.email} — {user.access}
                    <button
                      onClick={() => handleRemoveAccess(user.email)}
                      style={{
                        marginLeft: "1rem",
                        padding: "5px 10px",
                        border: "none",
                        backgroundColor: "#eee",
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

export default ViewDocument;
