# 🗃️ Database Schema Design (MongoDB - Mongoose)

This document describes the MongoDB collections and schema structure for the core platform.

---

## 👤 User Schema

```js
{
  _id: ObjectId,
  email: String, // unique
  passwordHash: String,
  resetPasswordToken: String, // for password reset
  resetPasswordExpires: Date, // expires in 1 hour
  createdAt: Date,
  updatedAt: Date
}

```
## 📄 Document Schema

```js
{
  _id: ObjectId,
  title: String,
  content: String, // WYSIWYG HTML
  author: ObjectId (ref: User),
  isPublic: Boolean,
  mentions: [String], // e.g., ['johndoe@example.com']
  sharedWith: [
    {
      email: String,
      access: String // 'view' or 'edit'
    }
  ],
  versions: [
    {
      title: String,
      content: String,
      editedAt: Date,
      editor: String // email of user
    }
  ],
  createdAt: Date,
  updatedAt: Date
}

```
## 🔍 Notes on Relationships
- Document.author → references User
- Document.sharedWith → controls private access
- mentions[] → used to auto-grant view access

## 🧠 Indexing Suggestions
- User.email → unique index
- Document.title + content → text index for full-text search
- Document.mentions → optional index for mentions-based search
- Document.sharedWith.email → for fast access checks
