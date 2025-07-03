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
        isPublic,
      });
      console.log("Document created:", res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to create document.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>New document</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />

        <div style={styles.toggleWrapper}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              style={styles.toggleInput}
            />
            <span style={styles.toggleText}>{isPublic ? "Public" : "Private"}</span>
          </label>
        </div>

        <textarea
          rows={10}
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
          required
        />

        <button type="submit" style={styles.button}>Save</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "700px",
    margin: "auto",
    fontFamily: "system-ui",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "1.5rem",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
  },
  textarea: {
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
    resize: "vertical",
    minHeight: "200px",
  },
  button: {
    backgroundColor: "#0a66ff",
    color: "#fff",
    padding: "0.75rem 1.25rem",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  toggleWrapper: {
    display: "flex",
    alignItems: "center",
  },
  toggleLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  toggleInput: {
    transform: "scale(1.4)",
    cursor: "pointer",
  },
  toggleText: {
    fontSize: "15px",
    color: "#333",
  },
};

export default CreateDocument;
