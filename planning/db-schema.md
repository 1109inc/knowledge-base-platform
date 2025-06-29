# 🗃️ Database Schema Design (MongoDB - Mongoose)

This document describes the MongoDB collections and schema structure for the core platform.

---

## 👤 User Schema

```js
{
  _id: ObjectId,
  email: String, // unique
  passwordHash: String,
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
  mentions: [String], // e.g., ['johndoe']
  createdAt: Date,
  updatedAt: Date
}
```
## 🔐 Access Control Schema
- This controls who can view/edit each private document.

```js
{
  _id: ObjectId,
  documentId: ObjectId (ref: Document),
  userId: ObjectId (ref: User),
  accessType: String // 'view' or 'edit'
}
```
## 🔍 Notes on Relationships
- Document.author → references User
- AccessControl.documentId + userId → controls private access
- mentions[] → used to auto-grant view access

## 🔐 Indexing Suggestions
- User.email → unique index
- Document.title, Document.content → for full-text search
- Compound index on AccessControl.documentId + userId