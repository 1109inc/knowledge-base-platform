const Document = require("../models/Document");

const createDocument = async (req, res) => {
  const { title, content, isPublic, mentions } = req.body;

  try {
    const document = await Document.create({
      title,
      content,
      isPublic,
      mentions: mentions || [],
      author: req.user.id, // set by JWT middleware
    });

    res.status(201).json({
      message: "Document created successfully",
      document,
    });
  } catch (error) {
    console.error("Create document error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createDocument };
