# QuantBot Production Deployment Guide

QuantBot is optimized for production deployment across **Vercel** (Frontend), **Render** (FastAPI Backend), and **Supabase** (PostgreSQL Database).

---

## 1. Database Setup (Supabase PostgreSQL)

1. Create a free account at [Supabase](https://supabase.com/).
2. Create a new project named `QuantBot`.
3. Navigate to **Project Settings -> Database** and copy the URI Connection String (`DATABASE_URL`).
4. Replace `postgres://` with `postgresql+asyncpg://` if needed in environment variables.

---

## 2. Backend Deployment (Render)

1. Create a free account at [Render](https://render.com/).
2. Click **New + -> Web Service** and connect your GitHub repository.
3. Set the root directory to `backend`.
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `DATABASE_URL`: Your Supabase PostgreSQL Connection String
   - `SECRET_KEY`: Random 32+ character JWT Secret string
   - `ANTHROPIC_API_KEY`: Your Anthropic Claude API Key (Optional)
   - `TELEGRAM_BOT_TOKEN`: Telegram Bot Token (Optional)
   - `TELEGRAM_CHAT_ID`: Telegram Chat ID (Optional)

---

## 3. Frontend Deployment (Vercel)

1. Create a free account at [Vercel](https://vercel.com/).
2. Import your GitHub repository and select the `frontend` root folder.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://quantbot-api.onrender.com/api/v1`)
7. Click **Deploy**. Vercel will build and assign your production HTTPS URL.
