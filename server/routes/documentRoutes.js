// Import Express framework
const express = require("express");
// Create a new router instance
const router = express.Router();
// Import document controller functions
const {
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
} = require("../controllers/documentController");
// Import authentication middleware to protect routes
const protect = require("../middlewares/authMiddleware");

// --- General Document Routes ---

// POST /api/documents - Create a new document
// Protected route: only authenticated users can create documents
router.post("/", protect, createDocument);

// GET /api/documents - Get all documents accessible to the user
// Protected route: only authenticated users can view their accessible documents
router.get("/", protect, getAccessibleDocuments);

// GET /api/documents/search - Search for documents
// Protected route: only authenticated users can search documents
// This route must be defined before routes with /:id to avoid "search" being treated as an ID
router.get("/search", protect, searchDocuments);


// --- Document Specific Routes (identified by /:id) ---
// Note: Routes with more specific paths (e.g., /:id/share) should come before general /:id routes.

// POST /api/documents/:id/mention - Mention a user in a document
// Protected route
router.post("/:id/mention", protect, mentionUser);

// POST /api/documents/:id/share - Share a document with a user
// Protected route
router.post("/:id/share", protect, shareDocument);

// DELETE /api/documents/:id/share - Remove a user's access from a shared document
// Protected route
router.delete("/:id/share", protect, removeSharedUser);

// GET /api/documents/:id/versions - Get all versions of a specific document
// Protected route
router.get("/:id/versions", protect, getDocumentVersions);

// GET /api/documents/:id/diff - Compare two versions of a specific document
// Protected route
router.get("/:id/diff", protect, compareDocumentVersions);

// GET /api/documents/:id - Get a specific document by its ID
// Protected route
router.get("/:id", protect, getDocumentById);

// PUT /api/documents/:id - Update a specific document by its ID
// Protected route
router.put("/:id", protect, updateDocument);

// DELETE /api/documents/:id - Delete a specific document by its ID
// Protected route
router.delete("/:id", protect, deleteDocument);

// Export the router to be used in the main application
module.exports = router;
