// Import mongoose library
const mongoose = require("mongoose");

// Define the schema for a User
const userSchema = new mongoose.Schema(
  {
    // User's email address
    email: {
      type: String,
      required: true, // Email is a required field
      unique: true, // Email must be unique across all users
      lowercase: true, // Convert email to lowercase before saving
      trim: true, // Remove whitespace from both ends of the email string
    },
    // Hashed password for the user
    passwordHash: {
      type: String,
      required: true, // Password hash is a required field
    },
    // Token used for password reset functionality
    resetPasswordToken: String, // Optional field, stores the password reset token
    // Expiration date for the password reset token
    resetPasswordExpires: Date, // Optional field, stores the expiration date of the token
  },
  {
    // Mongoose options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the User model based on the schema
module.exports = mongoose.model("User", userSchema);
