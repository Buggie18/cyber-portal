# Cyber Portal

Node+Express+PostgreSQL backend and a React (Vite) frontend.

## Project Structure

```
cyber-portal/
  backend/           # Express API + PostgreSQL
  portal-frontend/   # React (Vite) UI
```

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)
- PostgreSQL 13+

## Quick Start

### 1) Clone and install

```bash
# from your workspace
git clone https://github.com/Buggie18/cyber-portal.git
cd cyber-portal

# install dependencies for each app
cd backend && npm install
cd portal-frontend && npm install
```

### 2) Configure environment variables (Backend)

Create `backend/.env` (do not commit this file). Example values:

```
PORT=8080
DB_USER=postgres
DB_HOST=localhost
DB_NAME=cyberportal
DB_PASSWORD=postgres
DB_PORT=5432
INIT_DB=false
JWT_SECRET=replace-with-strong-secret
```

- Ensure the database named in `DB_NAME` exists in PostgreSQL (create it if needed).
To initialize tables using `backend/init.sql` on startup, set `INIT_DB=true` for the first run, then set it back to `false`.

### 3) Run locally

- Start backend (from `backend/`):

```bash
npm start
# Server: http://localhost:8080
```

- Start frontend (from `portal-frontend/`):

```bash
npm run dev
# Vite dev server: http://localhost:5173 (by default)
```
Use two terminals:
- Terminal 1 (backend): cd backend && npm start
- Terminal 2 (frontend): cd portal-frontend && npm run dev
The frontend dev server proxies `/api` to `http://localhost:8080` via `vite.config.js`.

## Backend Overview

- Tech: Express 5, PostgreSQL (`pg`), JWT auth, bcrypt password hashing
- Key routes (all prefixed with `/api`):
  - `POST /register` — create a new user (demo/testing)
  - `POST /login` — returns JWT on successful login
  - `GET /policies` — list policies (JWT required)
  - `POST /policies` — create policy (JWT required)
- Health check: `GET /health`

## Frontend Overview

- Tech: React + Vite + MUI
- Auth token stored in `localStorage` as `token`
- Protected routes guard access to `Dashboard` and `Policies`

## Scripts

- Backend:
  - npm start — start API on http://localhost:8080
- Frontend:
  - npm run dev — Vite dev server (proxy /api to backend)
  - npm run build — production build
  - npm run preview — preview production build


