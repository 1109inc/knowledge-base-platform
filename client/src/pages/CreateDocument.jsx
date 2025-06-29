import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateDocument = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/documents", {
        title,
        content,
        isPublic
      });

      console.log("Document created:", res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to create document.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create New Document</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          rows={10}
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />{" "}
          Make Public
        </label>

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateDocument;
