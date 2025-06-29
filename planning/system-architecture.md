# 🧱 System Architecture: Knowledge Base Platform

This document outlines the high-level system architecture for the Knowledge Base Platform project built as part of the Frigga Cloud Labs SDE assignment.

---

## 🔧 Tech Stack Overview

| Layer      | Technology            |
|------------|------------------------|
| Frontend   | React.js               |
| Backend    | Node.js + Express.js   |
| Database   | MongoDB (via Mongoose) |
| Auth       | JWT (JSON Web Tokens)  |
| Editor     | Rich Text (WYSIWYG) - Quill.js or TipTap |

---

## 📐 System Architecture Diagram
```
[User Browser]
     ↓
[React Frontend]
     ↓ (HTTP API calls - Axios/Fetch)
[Express.js Backend API] ←→ [JWT Middleware]
     ↓
[MongoDB Database]
```

---

## 🧩 Component Breakdown

### 1. **React Frontend**
- Responsible for:
  - UI rendering
  - Routing (React Router)
  - Auth forms (login/signup/forgot)
  - WYSIWYG document editor
  - Document view & search
- Communicates with backend via Axios or Fetch.

---

### 2. **Express.js Backend**
- RESTful API provider
- Handles:
  - User registration/login/forgot password
  - JWT auth & protected routes
  - Document creation/editing/sharing
  - Mentioning and permission logic
  - Full-text search using MongoDB

---

### 3. **MongoDB Database**
- Stores:
  - User credentials
  - Documents (title, content, metadata)
  - Sharing permissions
  - Mentioned user tracking
- Mongoose schemas will enforce data structure.

---

### 4. **JWT Authentication Middleware**
- Verifies JWT tokens on protected routes
- Ensures that users can only access permitted resources

---

## 🛠️ Optional Enhancements (Future Phases)

- Version control (document history)
- Email notifications
- Admin dashboard
- Analytics and activity logs

---

## 🔐 Security Considerations

- JWT for secure stateless auth
- Passwords stored as hashed (bcrypt)
- Private documents only accessible to owner + shared users
- No access to private routes without token

---

