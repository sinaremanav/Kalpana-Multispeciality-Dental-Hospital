import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
