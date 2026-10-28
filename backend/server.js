import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api.js';
import authRouter from './routes/auth.js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Global Rate Limiting: 500 requests per 15 minutes
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});
app.use('/api', globalApiLimiter);

// Sensitive Auth Rate Limiting: 30 requests per 15 minutes
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/register', authRateLimiter);

// CORS Middleware supporting FRONTEND_URL and local dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Authentication Routes (Bcrypt Hashed Storage)
app.use('/api/auth', authRouter);

// General API Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1 style="color: #0284c7;">Kalpana Dental Clinic API Server</h1>
      <p style="color: #475569;">Backend REST API is running successfully on port ${PORT}.</p>
      <a href="/api/health" style="color: #0284c7; font-weight: bold;">Check API Health</a>
    </div>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Centralized Error handling middleware with Zod validation support
app.use((err, req, res, next) => {
  if (err?.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Please check the submitted fields.',
      errors: err.errors ? err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })) : undefined,
    });
  }
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
