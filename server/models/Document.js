const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String, // WYSIWYG HTML
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentions: {
      type: [String], // e.g., ["johndoe", "jane@example.com"]
      default: [],
    },
    sharedWith: {
      type: [
        {
          email: String,
          access: {
            type: String,
            enum: ["view", "edit"],
            default: "view",
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
