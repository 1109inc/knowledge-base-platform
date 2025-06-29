const express = require("express");
const router = express.Router();
const { createDocument, getAccessibleDocuments } = require("../controllers/documentController");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createDocument); // protected route
router.get("/", protect, getAccessibleDocuments); // <-- Add this

module.exports = router;
