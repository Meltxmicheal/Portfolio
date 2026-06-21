require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const pool = require('./config/db');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Trust Proxy: Required for Render/Vercel to see real client IPs ───────────
app.set('trust proxy', 1);

// ── CORS: support multiple allowed origins (comma-separated in env) ──────────
const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
}));

// ── Security & parsing ────────────────────────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// ── General Rate limiting ─────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Increased from 100 to 500
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ── Strict rate limiting for contact form (public endpoint) ──────────────────
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 messages per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many messages sent from this IP, please try again later.',
  skip: (req) => {
    // Don't count authenticated requests (admins)
    return !!req.header('Authorization');
  },
});

// ── Health check (before routes so it is always reachable) ───────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running', timestamp: new Date().toISOString() });
});

// ── Apply contact form rate limiter to the contact endpoint ──────────────────
app.use('/api/messages', contactLimiter);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT} | NODE_ENV=${process.env.NODE_ENV || 'development'}`);
  console.log(`[server] Allowed origins: ${allowedOrigins.join(', ')}`);
});

module.exports = { pool };
