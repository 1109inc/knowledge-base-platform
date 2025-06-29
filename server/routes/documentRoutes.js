const express = require("express");
const router = express.Router();
const { createDocument } = require("../controllers/documentController");
const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createDocument); // protected route

module.exports = router;
