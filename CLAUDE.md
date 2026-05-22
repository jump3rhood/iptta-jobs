# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

IPTTA Jobs is a job board for IPTTA (teacher training institute) graduates. Schools submit job listings, an admin approves them via email or the admin panel, and teachers browse publicly without login. Intended to be hosted at `jobs.iptta.com`.

## Commands

### Backend (`/backend`)
```bash
npm run dev     # Start with --watch (auto-restart on file change)
npm start       # Production start
```

### Frontend (`/frontend`)
```bash
npm run dev     # Vite dev server (default port 5173)
npm run build   # Production build
npm run preview # Preview production build
```

## Architecture

**Monorepo with separate `backend/` and `frontend/` directories.** Both use ES modules (`"type": "module"`).

### Backend (Node.js + Express + MongoDB)

- **Entry:** `backend/index.js` — mounts routes, connects Mongoose, starts server
- **Routes:**
  - `routes/jobs.js` — public: list (with filters), get by ID, submit new job
  - `routes/approve.js` — tokenized one-click approve/reject from email links (no auth, stateless UUID token)
  - `routes/admin.js` — JWT-protected CRUD: login, list all jobs, approve, reject, edit, delete
- **Model:** `models/Job.js` — single Mongoose model with `status` enum: `pending → active | rejected`, `active → expired`
- **Auth:** `middleware/auth.js` — reads `Authorization: Bearer <token>`, verifies JWT. Admin panel is single-password (no user accounts).
- **Email:** `utils/email.js` — sends approval email via Resend with embedded approve/reject URLs. Approve URL is derived from `CLIENT_URL` by replacing `jobs.` with `api.jobs.` — keep that pattern in mind if changing the URL structure.

### Frontend (React + Vite + Tailwind)

- **Routing:** React Router v6, defined in `App.jsx`. Root redirects to `/jobs`.
- **State management:** Two React Contexts:
  - `JobsContext` — public job data (job list, filters, single job fetch)
  - `AdminContext` — admin auth state (JWT token stored in context/localStorage) and admin API calls
- **Protected routes:** `ProtectedRoute` component checks `AdminContext` for a valid token before rendering `/admin/dashboard`.
- **Pages:** `JobBoard`, `JobDetail`, `SubmitJob`, `AdminLogin`, `AdminDashboard`
- **Components:** `Navbar`, `JobCard`, `JobFilters`, `LoadingSpinner`, `ProtectedRoute`

### Key design decisions

- Jobs auto-expire 60 days after approval (`expiresAt` set in both approve routes).
- The `approveToken` (UUID) is cleared from the document on approve or reject — it's single-use.
- Public job listing only returns `active` status jobs and only projects card-level fields (not contact details). Full contact info is only returned on the detail endpoint.
- No reject email is sent to the school — rejection is silent.

## Environment Variables

**Backend** (copy `backend/.env.example`):
```
MONGODB_URI=mongodb+srv://...
RESEND_API_KEY=re_...
ADMIN_PASSWORD=...
JWT_SECRET=...
ADMIN_EMAIL=...         # where approval emails are sent
CLIENT_URL=https://jobs.iptta.com
PORT=5000
```

**Frontend** (copy `frontend/.env.example`):
```
VITE_API_URL=http://localhost:5000   # backend URL
```

## Deployment

- **Frontend:** Vercel (free tier)
- **Backend:** Render.com (free tier)
- **Database:** MongoDB Atlas (free tier)
- **Email:** Resend.com (free tier)
- Production frontend URL: `jobs.iptta.com` | Backend: `api.jobs.iptta.com`
