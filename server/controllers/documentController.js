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
    const userEmail = req.user.email; // we'll attach email to req.user in a sec

    const documents = await Document.find({
      $or: [
        { isPublic: true },
        { author: req.user.id },
        { mentions: userEmail }
      ]
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

const mentionUser = async (req, res) => {
  const docId = req.params.id;
  const { email } = req.body;

  try {
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Only the author can mention
    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the author can mention users" });
    }

    // Don't add duplicate mentions
    if (document.mentions.includes(email)) {
      return res.status(400).json({ message: "User already mentioned" });
    }

    // Add to mentions
    document.mentions.push(email);
    await document.save();

    res.status(200).json({
      message: "User mentioned successfully",
      mentions: document.mentions,
    });
  } catch (error) {
    console.error("Mention user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const shareDocument = async (req, res) => {
  const docId = req.params.id;
  const { email, access } = req.body;

  if (!email || !["view", "edit"].includes(access)) {
    return res.status(400).json({ message: "Email and valid access level are required" });
  }

  try {
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the author can share this document" });
    }

    const alreadyShared = document.sharedWith.find((user) => user.email === email);
    if (alreadyShared) {
      return res.status(400).json({ message: "User already has access" });
    }

    document.sharedWith.push({ email, access });
    await document.save();

    res.status(200).json({
      message: "User shared successfully",
      sharedWith: document.sharedWith
    });
  } catch (error) {
    console.error("Share error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const removeSharedUser = async (req, res) => {
  const docId = req.params.id;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the author can remove shared users" });
    }

    const originalLength = document.sharedWith.length;
    document.sharedWith = document.sharedWith.filter(user => user.email !== email);

    if (document.sharedWith.length === originalLength) {
      return res.status(400).json({ message: "User was not shared with" });
    }

    await document.save();

    res.status(200).json({
      message: "User access removed successfully",
      sharedWith: document.sharedWith
    });
  } catch (error) {
    console.error("Remove share error:", error.message);
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
  mentionUser,
  shareDocument,
  removeSharedUser,
};
