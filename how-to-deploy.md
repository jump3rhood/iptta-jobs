# How to Deploy IPTTA Jobs

Stack: **Vercel** (frontend) · **Render** (backend) · **MongoDB Atlas** (database) · **Resend** (email)

Production URLs: `jobs.iptta.com` (frontend) · `api.jobs.iptta.com` (backend)

---

## Before You Start

You'll need accounts on:
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Render](https://render.com)
- [Vercel](https://vercel.com)
- [Resend](https://resend.com)

Your domain (`iptta.com`) must be pointing to a DNS provider you can edit (Cloudflare, GoDaddy, Namecheap, etc.).

---

## Step 1 — MongoDB Atlas (Database)

1. Log into MongoDB Atlas and create a new **Project** (e.g. `iptta-jobs-prod`)
2. Create a free **M0 cluster** in a region close to India (Mumbai / Singapore)
3. Go to **Database Access** → Add a new database user:
   - Username: `iptta-jobs`
   - Password: generate a strong random password — save it
   - Role: `Atlas Admin`
4. Go to **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Render's free tier uses rotating IPs so this is necessary
5. Go to your cluster → **Connect** → **Drivers** → copy the connection string
   - It looks like: `mongodb+srv://iptta-jobs:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with the password you saved
   - Append the database name before `?`: `...mongodb.net/iptta-jobs?retryWrites...`
6. **Save this URI** — you'll need it in Step 3

---

## Step 2 — Resend (Email)

> DNS verification can take up to 24 hours. Do this step first so it's ready by the time you deploy.

1. Log into [Resend](https://resend.com) and go to **Domains** → **Add Domain**
2. Enter `iptta.com` (or `jobs.iptta.com`) and click Add
3. Resend will show you DNS records to add — typically:
   - A `TXT` record for SPF
   - A `TXT` record for DKIM
   - A `MX` record (optional, for receiving bounces)
4. Add these records at your DNS provider and wait for verification (green checkmark in Resend)
5. Go to **API Keys** → Create a new key → copy it — you'll need it in Step 3
6. **While waiting for DNS**, the app still works using Resend's test sender (`onboarding@resend.dev`). Approval emails will still arrive at your `ADMIN_EMAIL`.

---

## Step 3 — Render (Backend)

1. Log into [Render](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `iptta-jobs-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Starter at $7/mo if you want always-on)

4. Go to the **Environment** tab and add all these variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://iptta-jobs:...` (from Step 1) |
   | `RESEND_API_KEY` | `re_...` (from Step 2) |
   | `EMAIL_FROM` | `IPTTA Jobs <noreply@iptta.com>` (set after domain verifies) |
   | `ADMIN_EMAIL` | `sonalandrews258@gmail.com` |
   | `ADMIN_PASSWORD` | (choose a strong password for the admin panel) |
   | `JWT_SECRET` | (generate a random 32+ character string — e.g. use `openssl rand -hex 32`) |
   | `CLIENT_URL` | `https://jobs.iptta.com` |
   | `API_URL` | `https://api.jobs.iptta.com` |
   | `PORT` | `5000` |

5. Click **Create Web Service** — Render will build and deploy
6. Once deployed, go to **Settings** → **Custom Domains** → Add `api.jobs.iptta.com`
7. Render will give you a CNAME value — add it at your DNS provider:
   - Type: `CNAME`
   - Name: `api.jobs`
   - Value: `<your-render-service>.onrender.com`

> **Free tier cold starts**: The free plan spins down after 15 minutes of inactivity. The first request after that takes ~30 seconds. For a low-traffic job board this is fine. Upgrade to Starter ($7/mo) if you want always-on.

---

## Step 4 — Vercel (Frontend)

1. Log into [Vercel](https://vercel.com) → **Add New Project** → Import from GitHub
2. Select your repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite (auto-detected)
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://api.jobs.iptta.com`
   - Set scope to **Production** only
5. Click **Deploy**
6. Once deployed, go to **Settings** → **Domains** → Add `jobs.iptta.com`
7. Vercel will show DNS instructions — typically add either:
   - An `A` record pointing to Vercel's IP, **or**
   - A `CNAME` record pointing to `cname.vercel-dns.com`

---

## Step 5 — Verify Everything Works

1. Visit `https://api.jobs.iptta.com/` — should show: *"Hi there! Welcome to IPTTA's Jobs Listing!"*
2. Visit `https://jobs.iptta.com/jobs` — the job board should load
3. Go to `https://jobs.iptta.com/admin` → log in with your `ADMIN_PASSWORD`
4. Create a magic link → use it to submit a test job
5. Check that the approval email arrives at your `ADMIN_EMAIL`
6. Click Approve in the email → job should appear on the public board

---

## Local Development (after deploying)

Your local setup is unchanged. The repo has:
- `frontend/.env.local` (gitignored) — `VITE_API_URL=http://localhost:5000`
- `backend/.env` (gitignored) — local values with `CLIENT_URL=http://localhost:5173`

Run as usual:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

The `frontend/.env.production` file (committed) ensures production builds always point to the right API even if the Vercel env var is missing.

---

## Environment Variables Quick Reference

### Backend (set on Render dashboard)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
RESEND_API_KEY=re_...
EMAIL_FROM=IPTTA Jobs <noreply@iptta.com>
ADMIN_EMAIL=sonalandrews258@gmail.com
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_32_char_random_secret
CLIENT_URL=https://jobs.iptta.com
API_URL=https://api.jobs.iptta.com
PORT=5000
```

### Frontend (set on Vercel dashboard)
```
VITE_API_URL=https://api.jobs.iptta.com
```

### Local dev — `backend/.env`
```
MONGODB_URI=mongodb+srv://...  (can use same Atlas cluster)
RESEND_API_KEY=re_...
ADMIN_EMAIL=sonalandrews258@gmail.com
ADMIN_PASSWORD=local_password
JWT_SECRET=any_local_secret
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5000
PORT=5000
```

### Local dev — `frontend/.env.local`
```
VITE_API_URL=http://localhost:5000
```
