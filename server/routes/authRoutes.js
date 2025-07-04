// Import Express framework
const express = require("express");
// Create a new router instance
const router = express.Router();
// Import authentication controller functions
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Define route for user registration
// POST /api/auth/register
router.post("/register", registerUser);

// Define route for user login
// POST /api/auth/login
router.post("/login", loginUser);

// Define route for forgot password functionality
// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// Define route for reset password functionality
// POST /api/auth/reset-password/:token (token is passed as a URL parameter)
router.post("/reset-password/:token", resetPassword);

// Export the router to be used in the main application
module.exports = router;
