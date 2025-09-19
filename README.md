# Cyber Portal

A simple monorepo with a Node/Express/PostgreSQL backend and a React (Vite) frontend.

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
git clone https://github.com/<your-username>/<your-repo>.git
cd cyber-portal

# install dependencies for each app
cd backend && npm install
cd ../portal-frontend && npm install
```

### 2) Configure environment variables (Backend)

Create `backend/.env` (do not commit this file). Example values:

```
PORT=8080
DB_USER=postgres
DB_HOST=localhost
DB_NAME=cyber_portal
DB_PASSWORD=postgres
DB_PORT=5432
INIT_DB=false
JWT_SECRET=replace-with-strong-secret
```

- To initialize tables using `backend/init.sql` on startup, set `INIT_DB=true` temporarily for the first run.

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

## Production Notes

- Do not commit real secrets. Use environment variables in production.
- Restrict CORS in `backend/index.js` for production (allow only your domain):
  - Example: `app.use(cors({ origin: ["https://your-frontend-domain"] }))`
- Configure a production database and set all `DB_*` variables accordingly.
- Build the frontend with `npm run build` in `portal-frontend/` and serve the static files using a static host or via a reverse proxy to the backend.

## Scripts

- Backend (`backend/package.json`):
  - `npm start` — start API
  - `npm run dev` — start API (same as start; add nodemon if desired)
- Frontend (`portal-frontend/package.json`):
  - `npm run dev` — start Vite dev server
  - `npm run build` — production build
  - `npm run preview` — preview production build

## License

Specify your license here (e.g., MIT).
