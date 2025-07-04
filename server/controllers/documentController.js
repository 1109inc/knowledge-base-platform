// Import Document model
const Document = require("../models/Document");

/**
 * Creates a new document.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const createDocument = async (req, res) => {
  // Destructure title, content, isPublic, and mentions from request body
  const { title, content, isPublic, mentions } = req.body;

  try {
    // Create a new document with the provided data and author ID from authenticated user
    const document = await Document.create({
      title,
      content,
      isPublic,
      mentions: mentions || [], // Default to an empty array if mentions are not provided
      author: req.user.id, // Author ID is set by the JWT authentication middleware
    });
    document.versions.push({
      title: document.title,
      content: document.content,
      editor: req.user.email, // Record who created this version
      editedAt: new Date() // Record the time of creation
    });
    await document.save();
    // Respond with success message and the created document
    res.status(201).json({
      message: "Document created successfully",
      document,
    });
    // Save the current state of the document as a new version
    
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Retrieves all documents accessible to the authenticated user.
 * This includes public documents, user's own documents, and documents shared with the user.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getAccessibleDocuments = async (req, res) => {
  try {
    const userEmail = req.user.email; // Get email of the authenticated user

    // Find all public documents
    const publicDocs = await Document.find({ isPublic: true });
    // Find all documents authored by the user
    const ownDocs = await Document.find({ author: req.user.id });
    // Find all documents shared with the user
    const sharedDocs = await Document.find({
      sharedWith: { $elemMatch: { email: userEmail } }, // Check if user's email is in the sharedWith array
    });

    // Combine all accessible documents
    const allDocs = [...publicDocs, ...ownDocs, ...sharedDocs];

    // Remove duplicate documents (if any document is public and also owned/shared)
    const uniqueDocs = Array.from(
      new Map(allDocs.map((doc) => [doc._id.toString(), doc])).values()
    );

    // Respond with the list of unique accessible documents
    res.status(200).json({ documents: uniqueDocs });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Retrieves a specific document by its ID.
 * Checks if the authenticated user has access to the document (public, author, or shared).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getDocumentById = async (req, res) => {
  try {
    // Find the document by ID and populate the author's email
    const doc = await Document.findById(req.params.id).populate("author", "email");

    if (!doc) {
      // If document not found, respond with 404
      return res.status(404).json({ message: "Document not found" });
    }

    const userEmail = req.user.email; // Get email of the authenticated user
    // Check if the user is in the sharedWith list
    const sharedEntry = doc.sharedWith.find((u) => u.email === userEmail);
    // Determine if the user has access
    const hasAccess =
      doc.isPublic || // Document is public
      doc.author.email === userEmail || // User is the author
      !!sharedEntry; // User is in the sharedWith list

    if (!hasAccess) {
      // If no access, respond with 403
      return res.status(403).json({ message: "Access denied" });
    }

    // Respond with the document data including author's email and sharedWith list
    res.status(200).json({
      document: {
        ...doc._doc, // Spread the document fields
        authorEmail: doc.author.email,
        sharedWith: doc.sharedWith,
      },
    });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Updates an existing document.
 * Only the author or users with 'edit' access can update.
 * Saves a version of the document before updating.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const updateDocument = async (req, res) => {
  const docId = req.params.id; // Get document ID from URL parameters
  const { title, content, isPublic } = req.body; // Destructure update data from request body

  try {
    // Find the document by ID and populate author's email
    const document = await Document.findById(docId).populate("author", "email");

    if (!document) {
      // If document not found, respond with 404
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the user is the author
    const isAuthor = document.author._id.toString() === req.user.id;
    // Check if the user has 'edit' access
    const isEditor = document.sharedWith.some(
      (u) => u.email === req.user.email && u.access === "edit"
    );

    if (!isAuthor && !isEditor) {
      // If not author and not editor, respond with 403
      return res.status(403).json({ message: "You are not allowed to edit this document" });
    }

    // Update document fields if they are provided in the request
    if (title) document.title = title;
    if (content) document.content = content;

    // Only the author can change the document's public visibility
    if (typeof isPublic === "boolean" && isAuthor) {
      document.isPublic = isPublic;
    }

    // Update the 'updatedAt' timestamp
    document.updatedAt = Date.now();
    document.versions.push({
      title: document.title,
      content: document.content,
      editor: req.user.email, // Record who edited this version
      editedAt: new Date() // Record the time of edit
    });
    // Save the updated document
    await document.save();

    // Respond with success message and the updated document
    res.status(200).json({
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Deletes a document.
 * Only the author of the document can delete it.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const deleteDocument = async (req, res) => {
  const docId = req.params.id; // Get document ID from URL parameters

  try {
    // Find the document by ID
    const document = await Document.findById(docId);

    if (!document) {
      // If document not found, respond with 404
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the authenticated user is the author
    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this document" });
    }

    // Delete the document
    await document.deleteOne();

    // Respond with success message
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Searches for documents based on a query string.
 * Search is performed on documents accessible to the user (own, public, shared).
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const searchDocuments = async (req, res) => {
  const userId = req.user.id; // ID of the authenticated user
  const email = req.user.email; // Email of the authenticated user
  const query = req.query.q; // Search query from URL query parameters

  // If no query is provided, respond with 400
  if (!query) return res.status(400).json({ message: "Query required" });

  try {
    // Find documents that match the query and are accessible to the user
    const docs = await Document.find({
      $and: [ // Both conditions must be met
        { // Accessibility condition
          $or: [
            { author: userId }, // Document is authored by the user
            { isPublic: true }, // Document is public
            { sharedWith: { $elemMatch: { email } } } // Document is shared with the user
          ]
        },
        { // Text search condition
          $text: { $search: query } // Perform text search on indexed fields
        }
      ]
    }).sort({ updatedAt: -1 }); // Sort results by last updated time

    // Respond with the found documents
    res.status(200).json({ documents: docs });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Adds a user mention to a document.
 * Only the author of the document can mention users.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const mentionUser = async (req, res) => {
  const docId = req.params.id; // Document ID from URL parameters
  const { email } = req.body; // Email of the user to mention from request body

  try {
    // Find the document by ID
    const document = await Document.findById(docId);

    if (!document) {
      // If document not found, respond with 404
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the authenticated user is the author
    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the author can mention users" });
    }

    // Check if the user is already mentioned to avoid duplicates
    if (document.mentions.includes(email)) {
      return res.status(400).json({ message: "User already mentioned" });
    }

    // Add the email to the mentions array
    document.mentions.push(email);
    // Save the updated document
    await document.save();

    // Respond with success message and the updated mentions list
    res.status(200).json({
      message: "User mentioned successfully",
      mentions: document.mentions,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Shares a document with another user.
 * Only the author of the document can share it.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const shareDocument = async (req, res) => {
  const docId = req.params.id; // Document ID from URL parameters
  const { email, access } = req.body; // Email and access level from request body

  // Validate that email and a valid access level ('view' or 'edit') are provided
  if (!email || !["view", "edit"].includes(access)) {
    return res.status(400).json({ message: "Email and valid access level are required" });
  }

  try {
    // Find the document by ID
    const document = await Document.findById(docId);

    if (!document) {
      // If document not found, respond with 404
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the authenticated user is the author
    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the author can share this document" });
    }

    // Check if the document is already shared with this user
    const alreadyShared = document.sharedWith.find((user) => user.email === email);
    if (alreadyShared) {
      return res.status(400).json({ message: "User already has access" });
    }

    // Add the user to the sharedWith array
    document.sharedWith.push({ email, access });
    // Save the updated document
    await document.save();

    // Respond with success message and the updated sharedWith list
    res.status(200).json({
      message: "User shared successfully",
      sharedWith: document.sharedWith
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Removes a user's access from a shared document.
 * Only the author of the document can remove shared users.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const removeSharedUser = async (req, res) => {
  const docId = req.params.id; // Document ID from URL parameters
  const { email } = req.body; // Email of the user to remove from request body

  // Validate that email is provided
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find the document by ID
    const document = await Document.findById(docId);

    if (!document) {
      // If document not found, respond with 404
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the authenticated user is the author
    if (document.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the author can remove shared users" });
    }

    const originalLength = document.sharedWith.length;
    // Filter out the user to be removed from the sharedWith array
    document.sharedWith = document.sharedWith.filter(user => user.email !== email);

    // If the user was not found in the sharedWith list, respond with 400
    if (document.sharedWith.length === originalLength) {
      return res.status(400).json({ message: "User was not shared with" });
    }

    // Save the updated document
    await document.save();

    // Respond with success message and the updated sharedWith list
    res.status(200).json({
      message: "User access removed successfully",
      sharedWith: document.sharedWith
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Retrieves all versions of a document.
 * Access is granted if the document is public, or if the user is the author, mentioned, or shared with.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const getDocumentVersions = async (req, res) => {
  try {
    // Find the document by ID
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      // If document not found, respond with 404
      return res.status(404).json({ message: "Document not found" });
    }

    // Determine if the user has access to versions
    const isOwnerOrMentioned = doc.author.toString() === req.user.id ||
      doc.mentions.includes(req.user.email) ||
      doc.sharedWith.some(u => u.email === req.user.email);

    // If the document is not public and the user doesn't have specific access, respond with 403
    if (!doc.isPublic && !isOwnerOrMentioned) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Respond with the list of document versions
    res.status(200).json({ versions: doc.versions });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Compares two versions of a document.
 * Takes 'old' and 'new' version indices as query parameters. 'new' can be "current".
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const compareDocumentVersions = async (req, res) => {
  const { id } = req.params; // Document ID from URL parameters
  const { old, new: newest } = req.query; // Old and new version indices from query parameters

  try {
    // Find the document by ID
    const doc = await Document.findById(id);
    if (!doc) {
      // If document not found, respond with 404
      return res.status(404).json({ message: "Document not found" });
    }

    // Parse version indices to integers
    const v1 = parseInt(old);
    // 'newest' can be the string "current" or a number
    const v2 = newest === "current" ? "current" : parseInt(newest);

    // Validate that version indices are valid numbers (or "current" for v2)
    if (isNaN(v1) || (v2 !== "current" && isNaN(v2))) {
      return res.status(400).json({ message: "Invalid version indexes" });
    }

    // Get data for the first version
    const versionData1 = doc.versions[v1];
    // Get data for the second version (either a specific version or the current document state)
    const versionData2 = v2 === "current" ? doc : doc.versions[v2];

    // If either version is not found, respond with 404
    if (!versionData1 || !versionData2) {
      return res.status(404).json({ message: "One or both versions not found" });
    }

    // Prepare title diff object
    const titleDiff = {
      from: versionData1.title || "", // Default to empty string if title is undefined
      to: versionData2.title || ""
    };

    // Prepare content diff object
    const contentDiff = {
      from: versionData1.content || "", // Default to empty string if content is undefined
      to: versionData2.content || ""
    };

    // Respond with version numbers and their diffs
    res.status(200).json({
      version1: v1,
      version2: v2,
      titleDiff,
      contentDiff
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Server error" });
  }
};

// Export all controller functions
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
  getDocumentVersions,
  compareDocumentVersions,
};
