# Premium Cinematic Portfolio

A full-stack, production-ready portfolio website with a luxury futuristic UI, dynamic content management, and secure admin authentication.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, GSAP, Lenis (Smooth Scroll)
- **Backend**: Node.js, Express.js, JWT, Bcrypt
- **Database**: PostgreSQL (Supabase)
- **Image Storage**: Cloudinary

## Project Structure
- `/frontend`: Next.js application
- `/backend`: Express API
- `/database`: Schema and migrations

## Setup & Local Development

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Run the SQL from `frontend/supabase-schema.sql` in the Supabase SQL Editor.
3. Get your connection string from Project Settings > Database.

### 2. Image Storage (Cloudinary)
1. Create a free account on [Cloudinary](https://cloudinary.com/).
2. Get your Cloud Name, API Key, and API Secret from the Dashboard.

### 3. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on the requirements:
   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_random_secret_string
   ADMIN_EMAIL=your_email@example.com
   ADMIN_PASSWORD_HASH=your_bcrypt_hash
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   FRONTEND_URL=http://localhost:3000
   ```
4. Run `npm run dev` to start the server.

### 4. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
4. Run `npm run dev` to start the frontend.

## Deployment Instructions

### Backend (Render / Railway)
1. Push your code to GitHub.
2. Create a new "Web Service" on Render.
3. Connect your repository.
4. Set the Build Command: `cd backend && npm install`
5. Set the Start Command: `cd backend && npm start`
6. Add all environment variables from your backend `.env`.

### Frontend (Vercel)
1. Connect your repository to Vercel.
2. Vercel will automatically detect Next.js.
3. Set the Root Directory to `frontend`.
4. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend.

## Security Note
- Never hardcode the `ADMIN_PASSWORD_HASH`. Generate it once using a script and store it only in environment variables.
- Ensure CORS settings in the backend are restricted to your production frontend URL.
