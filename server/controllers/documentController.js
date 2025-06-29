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

const getDocumentById = async (req, res) => {
  const docId = req.params.id;

  try {
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const isAuthor = document.author.toString() === req.user.id;
    const isPublic = document.isPublic;

    if (!isPublic && !isAuthor) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ document });
  } catch (error) {
    console.error("Get document by ID error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateDocument = async (req, res) => {
  const docId = req.params.id;
  const { title, content } = req.body;

  try {
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to edit this document" });
    }

    if (title) document.title = title;
    if (content) document.content = content;
    document.updatedAt = Date.now();

    await document.save();

    res.status(200).json({
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    console.error("Update document error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteDocument = async (req, res) => {
  const docId = req.params.id;

  try {
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this document" });
    }

    await document.deleteOne();

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const searchDocuments = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const documents = await Document.find({
      $and: [
        {
          $or: [
            { isPublic: true },
            { author: req.user.id }
          ]
        },
        {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } }
          ]
        }
      ]
    }).sort({ updatedAt: -1 });

    res.status(200).json({ documents });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDocument,
  getAccessibleDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  searchDocuments,
};
