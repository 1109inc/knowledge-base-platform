const express = require("express");
const router = express.Router();
const { 
  createDocument, 
  getAccessibleDocuments, 
  getDocumentById, 
  updateDocument, 
  deleteDocument, 
  searchDocuments,
  mentionUser,
  shareDocument 
} = require("../controllers/documentController");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createDocument); // protected route
router.get("/", protect, getAccessibleDocuments); // <-- Add this
router.get("/search", protect, searchDocuments); // <-- add this
router.post("/:id/mention", protect, mentionUser); // <-- add this
router.post("/:id/share", protect, shareDocument); // <-- add this before /:id
router.get("/:id", protect, getDocumentById); // <-- new route
router.put("/:id", protect, updateDocument); // <-- add this
router.delete("/:id", protect, deleteDocument); // ✅ Delete route

module.exports = router;
