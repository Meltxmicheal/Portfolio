# 🌌 Cinematic Portfolio — Premium Full-Stack Portfolio Website

A stunning, dark-luxury portfolio website with an animated public frontend and a full-featured admin dashboard. Built with Next.js 14, Supabase, Framer Motion, and Lenis smooth scroll.

---

## ✨ Features

### Public Portfolio
- **Fullscreen hero** with animated typography, floating particles, and mouse parallax
- **Custom magnetic cursor** with smooth trailing ring effect
- **Cinematic loading screen** with animated progress bar
- **About section** with profile photo, bio, skills by category, education & experience
- **Projects section** with filter tabs, animated glass cards, and live/GitHub links
- **Project detail pages** with features list, gallery, and tech stack sidebar
- **Contact section** with social links and a working contact form
- **Lenis smooth scrolling** and scroll-triggered reveal animations
- **Gradient blob backgrounds**, grid pattern, and glassmorphism cards

### Admin Dashboard
- **Secure login** with email/password + Google OAuth via Supabase Auth
- **Profile editor** with drag-and-drop avatar and resume upload
- **Projects manager** — create, edit, delete, toggle featured, upload cover images
- **Skills manager** — add/remove skills by category with proficiency sliders
- **Experience manager** — full CRUD for work history
- **Certificates manager** — upload and manage certificates
- **Messages inbox** — read, reply, and delete contact form submissions
- **Dashboard overview** with stats and quick actions

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/yourname/cinematic-portfolio
cd cinematic-portfolio
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL editor, run the entire contents of **`supabase-schema.sql`**
3. Go to **Storage → New Bucket**, name it `portfolio`, and set it to **Public**
4. In **Authentication → Providers**, enable **Google** if you want OAuth login
5. Copy your project URL and keys from **Settings → API**

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Create your admin user

In Supabase → **Authentication → Users → Add User**, create a user with your email and password. This will be your admin login.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard.

---

## 📁 Project Structure

```
cinematic-portfolio/
├── app/
│   ├── layout.tsx              # Root layout (Lenis + cursor + loading)
│   ├── page.tsx                # Public homepage
│   ├── globals.css             # All styles, animations, variables
│   ├── api/contact/route.ts    # Contact form API
│   ├── projects/[slug]/        # Project detail pages
│   └── admin/
│       ├── layout.tsx          # Admin layout with sidebar
│       ├── page.tsx            # Dashboard overview
│       ├── login/page.tsx      # Auth page
│       ├── profile/page.tsx    # Profile editor
│       ├── projects/page.tsx   # Projects CRUD
│       ├── skills/page.tsx     # Skills manager
│       ├── experience/page.tsx # Experience CRUD
│       ├── certificates/       # Certificates manager
│       └── messages/page.tsx   # Inbox
├── components/
│   ├── ui/
│   │   ├── CustomCursor.tsx    # Magnetic cursor with trailing ring
│   │   ├── LoadingScreen.tsx   # Cinematic intro screen
│   │   ├── Navbar.tsx          # Fixed nav with scroll effects
│   │   └── Footer.tsx
│   └── sections/
│       ├── HeroSection.tsx     # Animated fullscreen hero
│       ├── AboutSection.tsx    # Bio, skills, education, experience
│       ├── ProjectsSection.tsx # Filterable project grid
│       └── ContactSection.tsx  # Social links + contact form
├── lib/
│   └── supabase.ts             # Client, types, data helpers
├── supabase-schema.sql         # Full database schema with seed data
└── .env.example
```

---

## 🎨 Customization

### Colors
Edit `tailwind.config.js` and `app/globals.css` CSS variables:
```css
--violet-glow: #7c3aed;   /* Primary accent */
--blue-glow:   #2563eb;   /* Secondary accent */
--cyan-glow:   #06b6d4;   /* Tertiary accent */
```

### Content
All content is managed through the **Admin Dashboard** at `/admin`. After logging in:
1. Go to **Profile** to set your name, bio, photo, and social links
2. Go to **Skills** to add your tech stack
3. Go to **Projects** to showcase your work
4. Go to **Experience** to add your work history
5. Go to **Certificates** to display your credentials

### Fonts
The project uses:
- **Clash Display** — headings (loaded via fontshare CDN)
- **DM Sans** — body text (Google Fonts)
- **JetBrains Mono** — code/metadata accents (Google Fonts)

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion + GSAP |
| Smooth Scroll | Lenis |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Notifications | react-hot-toast |
| File Upload | react-dropzone |
| Icons | react-icons |

---

## 📦 Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```
Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Other platforms
```bash
npm run build
npm start
```

---

## 🔒 Security Notes

- Row Level Security (RLS) is enabled on all Supabase tables
- Public users can only **read** portfolio data and **insert** contact messages
- All write operations require authentication
- Admin routes check `supabase.auth.getUser()` on every load

---

## 📄 License

MIT — free to use and modify for personal and commercial projects.

---

Built with ♥ and way too many late nights.
