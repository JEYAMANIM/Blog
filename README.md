# BlogEditor

A full-stack Blog Application featuring a modern rich-text article editor and responsive reader view.

## Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for fast bundling
- **Tailwind CSS v4** for modern styling
- **React Router v7** for client-side routing
- **React Quill New** for rich-text article authoring

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** ORM
- **Neon Serverless PostgreSQL** database
- **Static file serving** for image uploads

---

## Getting Started

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Deployment
- **Frontend**: Hosted on [Cloudflare Pages](https://pages.cloudflare.com/)
- **Database**: [Neon Tech Serverless PostgreSQL](https://neon.tech/)
