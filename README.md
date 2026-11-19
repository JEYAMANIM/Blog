# BlogEditor

A full-stack Blog Application featuring a modern rich-text article editor and responsive reader view.

## Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for fast bundling
- **Tailwind CSS v4** for modern styling
- **React Router v7** for client-side routing
- **React Quill New** for rich-text article authoring
- **Deployed on**: [Cloudflare Pages](https://blog-editor-4uh.pages.dev)

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy** ORM
- **Neon Serverless PostgreSQL** database
- **Static file serving** for image uploads (`uploads/`)

---

## Deployment Guide

### 1. Backend Deployment (Render / Cloud)
Because FastAPI uses native PostgreSQL drivers (`psycopg2`) and local file uploads (`uploads/`), it is hosted on a Python cloud platform (like Render or Railway):

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
2. Connect your GitHub repository: `https://github.com/JEYAMANIM/Blog.git`.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string (configured in `main.py`).
5. Copy the assigned URL (e.g., `https://blog-backend-xxxx.onrender.com`).

---

### 2. Frontend Deployment (Cloudflare Pages)
The frontend is already configured and deployed to **Cloudflare Pages**:

- **Production URL**: [https://blog-editor-4uh.pages.dev](https://blog-editor-4uh.pages.dev)
- **Preview Deployments**: Automated on push.

To point the frontend to your deployed backend URL:
- Set `VITE_API_URL = https://your-backend-url.onrender.com` in your Cloudflare Pages project settings (**Settings > Environment variables**), or update `frontend/src/config.ts`.
