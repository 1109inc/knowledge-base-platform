# ✅ Feature List and User Stories

This document outlines all the required core features and user-centric stories for the Knowledge Base Platform.

---

## 📋 Core Features

### ✅ 1. Authentication System
- [x] User registration with email/password
- [x] User login with JWT
- [x] Forgot password functionality (email-based reset)
- [x] JWT-protected private routes

---

### ✅ 2. Document Management
- [x] Create new documents using a WYSIWYG editor
- [x] Edit existing documents with version tracking
- [x] View a list of accessible documents with metadata (title, author, last modified)
- [x] View full document content
- [x] Global search across document titles and content

---

### ✅ 3. User Collaboration
- [x] Mention users using `@username` inside documents
- [x] Automatically grant mentioned users read access
- [x] Notify users when they are mentioned *(optional UI-level)*

---

### ✅ 4. Privacy Controls & Sharing
- [x] Mark documents as **Public** (anyone with link can view)
- [x] Mark documents as **Private** (only shared users can view)
- [x] Add/remove user access for private documents
- [x] Manage access levels (view/edit)

---

## 🧑‍💻 User Stories

### 🧾 As a user...
- I want to register and log in using my email and password
- [x] I want to reset my password if I forget it
- [x] I want to create formatted documents using a WYSIWYG editor
- [x] I want to edit my documents and have them auto-saved
- [x] I want to view all documents I have access to
- [x] I want to search for documents by title or content
- [x] I want to mention other users to collaborate with them
- [x] I want mentioned users to get view access automatically
- [x] I want to control whether my document is public or private
- [x] I want to add or remove people’s access to private documents
- [x] I want to define whether someone can just view or also edit my document

---

## 🔮 Bonus Features Implemented
- [x] Version control with full history and editor timestamps
- [x] Compare any two versions (basic diff view)

---

## ⏭️ Future Features (Unimplemented)
- Activity feed and notifications
- Analytics for document views
