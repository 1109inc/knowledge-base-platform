# 🌐 API Design: Knowledge Base Platform

This document outlines all backend RESTful API endpoints for the core features of the platform.

---

## 📁 Authentication Routes

### POST `/api/auth/register`
- Registers a new user
- Body:
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```
### POST `/api/auth/login`
- Logs in user and returns JWT
- Body:
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```
### POST `/api/auth/forgot-password`
- Triggers email with reset link
- Body:
```json
{
  "email": "user@example.com",
}
```
### POST `/api/auth/reset-password/:token`
- Resets password via token from email
- Body:
```json
{
  "newPassword": "newPassword123"
}
```
## 📄 Document Routes
🔒 All require JWT unless document is public.

### GET `/api/documents`
- List all accessible documents (user’s or public)

### GET `/api/documents/:id`
- View a specific document (if access is allowed)

### POST `/api/documents`
- Create a new document
- Body
```json
{
  "title": "Getting Started",
  "content": "<p>WYSIWYG content</p>",
  "isPublic": false
}
```
### PUT /api/documents/:id
- Update a document (if author or editor)
- Body (partial or full):
```json
{
  "title": "Updated Title",
  "content": "<p>Updated content</p>"
}
```
### DELETE `/api/documents/:id`
- Delete document (if author)

## 🔍 Search Route
### GET `/api/search?q=term`
- Search all accessible documents by title/content

## 🧑‍🤝‍🧑 Collaboration & Sharing Routes
### POST `/api/documents/:id/mention`
- Mention a user and auto-grant view access
- Body:
```json
{
  "username": "johndoe"
}
```
### POST /api/documents/:id/share
- Add user to private document access
- Body:
```json
{
  "email": "user@example.com",
  "access": "view"  // or "edit"
}
```
### DELETE /api/documents/:id/share
- Remove a user’s access
- Body:
```json
{
  "email": "user@example.com"
}
```
## 🔐 JWT Auth Flow
- All protected routes require following http header: `Authorization: Bearer \<token>`

