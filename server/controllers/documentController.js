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

const getAccessibleDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [
        { isPublic: true },
        { author: req.user.id }, // only user's private docs for now
      ],
    }).sort({ updatedAt: -1 });

    res.status(200).json({ documents });
  } catch (error) {
    console.error("Get documents error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDocument,
  getAccessibleDocuments,
};
