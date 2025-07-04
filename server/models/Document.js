// Import mongoose library
const mongoose = require("mongoose");

// Define the schema for a Document
const documentSchema = new mongoose.Schema(
  {
    // Title of the document
    title: {
      type: String,
      required: true, // Title is a required field
      trim: true, // Remove whitespace from both ends of the string
    },
    // Content of the document, stored as HTML string from a WYSIWYG editor
    content: {
      type: String,
      required: true, // Content is a required field
    },
    // Boolean flag indicating if the document is public or private
    isPublic: {
      type: Boolean,
      default: false, // Defaults to private
    },
    // Reference to the User who authored the document
    author: {
      type: mongoose.Schema.Types.ObjectId, // Stores the ObjectId of the author
      ref: "User", // Refers to the 'User' model
      required: true, // Author is a required field
    },
    // Array of strings representing user mentions (e.g., emails or usernames)
    mentions: {
      type: [String],
      default: [], // Defaults to an empty array
    },
    // Array of objects defining users with whom the document is shared
    sharedWith: {
      type: [
        {
          email: String, // Email of the shared user
          access: {
            type: String,
            enum: ["view", "edit"], // Access level can only be 'view' or 'edit'
            default: "view", // Defaults to 'view' access
          },
        },
      ],
      default: [], // Defaults to an empty array (no shares)
    },
    // Array of objects representing different versions of the document
    versions: {
      type: [
        {
          title: String, // Title of this version
          content: String, // Content of this version
          editedAt: { type: Date, default: Date.now }, // Timestamp of when this version was created
          editor: String, // Email or user ID of the editor for this version
        },
      ],
      default: [], // Defaults to an empty array (no previous versions initially)
    },
  },
  {
    // Mongoose options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create a text index on 'title' and 'content' fields for text search capabilities
documentSchema.index({ title: "text", content: "text" });

// Create and export the Document model based on the schema
module.exports = mongoose.model("Document", documentSchema);
