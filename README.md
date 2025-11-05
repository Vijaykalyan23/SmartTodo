# SmartTodo

SmartTodo is a **MERN (MongoDB, Express, React, Node.js)** productivity app with **AI-powered task suggestions**.

---

## 📁 Repository Structure

- **backend/** — Express + Mongoose API (tasks, auth, AI suggestion endpoint)  
- **frontend/** — React + Vite + Tailwind UI  

---

## ⚙️ Quick Local Setup

### 1️⃣ Backend Setup

1. Copy `.env.example` → `.env` and fill in the required values  
   *(Do **NOT** commit `.env` to Git.)*

2. Install dependencies and start the backend server:
   ```powershell
   cd backend
   npm install
   node server.js
### 2️⃣ Frontend Setup
  ```powershell

   cd frontend
   npm install
   npm run dev
```
### ⚠️ Important Notes
- This repository must never contain secrets.

- Ensure .env is listed in .gitignore (it already is by default).

- If secrets are accidentally committed:
    - Immediately rotate those credentials.
    - Remove them from Git history.

### 🚀 Project Status
- **backend**: CRUD tasks, AI suggestion endpoint (optional), JWT auth scaffolded

- **frontend**: Task list, add/delete, completion toggle, category filter, sorting

See (backend/.env.example) and project documentation for environment variable details


