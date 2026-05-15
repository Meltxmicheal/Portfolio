# Meltx Micheal — Cinematic Portfolio

> **Full-stack AI/ML developer portfolio** — Next.js 14, Supabase, Cloudinary, Express.js

[![Deploy Status](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://meltxmicheal.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://meltxmicheal-api.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

---

## ✨ Features

- **Cinematic UI** — glassmorphism cards, ambient aurora glows, CSS grain texture, smooth Lenis scroll
- **Dynamic Content** — all projects, skills, and profile data managed via a secure admin dashboard
- **Image Optimization** — Cloudinary loader with automatic WebP/AVIF conversion (`f_auto,q_auto`)
- **SEO Ready** — `robots.ts`, `sitemap.ts`, full OpenGraph + Twitter Card metadata
- **Performance** — Framer Motion only (GSAP removed), `will-change: transform` on all scroll-animated elements
- **Error-Resilient** — graceful error boundary for Render cold-starts, loading skeletons
- **Custom 404** — on-brand glitch animation page

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Animations | Framer Motion, Lenis smooth scroll |
| Backend | Node.js, Express.js, JWT auth, bcryptjs |
| Database | PostgreSQL via Supabase |
| Images | Cloudinary (auto format + quality) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
Protfolio/
├── frontend/               # Next.js 14 application
│   ├── app/
│   │   ├── layout.tsx      # Server component — Metadata export
│   │   ├── page.tsx        # SSR: fetches all data, passes as props
│   │   ├── loading.tsx     # Shimmer skeleton while data loads
│   │   ├── error.tsx       # Graceful error boundary
│   │   ├── not-found.tsx   # On-brand 404 page
│   │   ├── robots.ts       # Auto-generated robots.txt
│   │   ├── sitemap.ts      # Auto-generated sitemap.xml
│   │   ├── projects/[slug] # Individual project detail pages
│   │   └── admin/          # Protected CMS dashboard
│   ├── components/
│   │   ├── sections/       # HeroSection, AboutSection, ProjectsSection…
│   │   ├── ui/             # Navbar, Footer, CustomCursor, ClientProviders
│   │   └── admin/          # Admin-specific components
│   ├── lib/
│   │   ├── api.ts          # All backend fetch calls, fully typed
│   │   └── supabase.ts     # Supabase client + TypeScript types
│   ├── cloudinary-loader.js # Custom Next.js image loader
│   ├── .env.example        # Template — copy to .env.local
│   └── next.config.js
└── backend/                # Express REST API
    ├── controllers/        # Route logic
    ├── middleware/         # JWT auth guard
    ├── routes/             # Express routers
    ├── config/             # Cloudinary, DB config
    ├── index.js            # Server entry point
    └── .env.example        # Template — copy to .env
```

---

## 🚀 Local Development

### Prerequisites
- Node.js ≥ 18
- A [Supabase](https://supabase.com) project
- A [Cloudinary](https://cloudinary.com) account

### 1 — Database (Supabase)
1. Create a new Supabase project.
2. Run `frontend/supabase-schema.sql` in the Supabase SQL editor.
3. Copy your connection string from **Settings → Database**.

### 2 — Backend
```bash
cd backend
npm install
cp .env.example .env          # fill in your values
npm run dev                   # starts on http://localhost:5000
```

Required `.env` variables (see `.env.example` for descriptions):
```
PORT, DATABASE_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD_HASH,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, FRONTEND_URL
```

Generate your admin password hash:
```bash
node -e "require('bcryptjs').hash('yourpassword', 10).then(console.log)"
```

### 3 — Frontend
```bash
cd frontend
npm install
cp .env.example .env.local    # fill in your values
npm run dev                   # starts on http://localhost:3000
```

Required `.env.local` variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ☁️ Deployment

### Backend → Render
1. Push code to GitHub.
2. Create a **Web Service** on [Render](https://render.com).
3. Set **Build Command**: `cd backend && npm install`
4. Set **Start Command**: `cd backend && npm start`
5. Add all environment variables from `backend/.env.example`.

### Frontend → Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api
   NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
   ```
4. Deploy — Vercel auto-detects Next.js.

### After Deploying
- Set the **Render backend URL** as `NEXT_PUBLIC_API_URL` in Vercel env vars.
- Set the **Vercel URL** as `FRONTEND_URL` in Render env vars (for CORS).
- Add the live URL to the GitHub repo **Website** field.

---

## 🔒 Security Notes

- Never commit `.env` or `.env.local` — only `.env.example`.
- `ADMIN_PASSWORD_HASH` must be a bcrypt hash — never store a plain password.
- CORS is restricted to `FRONTEND_URL` in production.
- Admin routes require a valid JWT bearer token.

---

## 📄 License

MIT © [Meltx Micheal](https://github.com/Meltxmicheal)
