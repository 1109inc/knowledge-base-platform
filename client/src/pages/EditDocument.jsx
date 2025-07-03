import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [document, setDocument] = useState(null); // Store entire document for access check

  const userEmail = localStorage.getItem("userEmail");

  const canEdit =
    document &&
    (document.authorEmail === userEmail ||
      document.sharedWith?.some(
        (u) => u.email === userEmail && u.access === "edit"
      ));

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/documents/${id}`);
        const doc = res.data.document;

        setDocument(doc); // Save the full document
        setTitle(doc.title);
        setContent(doc.content);
        setIsPublic(doc.isPublic);
      } catch (err) {
        console.error(err);
        setError("Failed to load document");
      }
    };

    fetchDoc();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.put(`/documents/${id}`, {
        title,
        content,
        isPublic,
      });

      navigate(`/documents/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update document");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!document) return <p>Loading...</p>;
  if (!canEdit)
    return <p style={{ color: "red" }}>You do not have permission to edit this document.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit Document</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "600px",
        }}
      >
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          rows={10}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {document.authorEmail === userEmail && (
  <label>
    <input
      type="checkbox"
      checked={isPublic}
      onChange={(e) => setIsPublic(e.target.checked)}
    />{" "}
    Make Public
  </label>
)}


        <button type="submit" style={{ backgroundColor: "#007bff", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditDocument;
