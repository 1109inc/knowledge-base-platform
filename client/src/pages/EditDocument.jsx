import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`/documents/${id}`);
        setTitle(res.data.document.title);
        setContent(res.data.document.content);
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
      });

      navigate(`/documents/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to update document");
    }
  };

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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditDocument;
