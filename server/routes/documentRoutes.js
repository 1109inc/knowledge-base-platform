const express = require("express");
const router = express.Router();
const { createDocument, getAccessibleDocuments, getDocumentById, updateDocument, deleteDocument } = require("../controllers/documentController");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createDocument); // protected route
router.get("/", protect, getAccessibleDocuments); // <-- Add this
router.get("/:id", protect, getDocumentById); // <-- new route
router.put("/:id", protect, updateDocument); // <-- add this
router.delete("/:id", protect, deleteDocument); // ✅ Delete route

module.exports = router;
