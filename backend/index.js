// index.js — Main Express server entry point
const express = require('express');
const cors    = require('cors');
require('dotenv').config();
require('./config/Passport/index');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS — allows your React frontend to talk to this backend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://skillswap-sable-xi.vercel.app'
  ],
  credentials: true
}));

// Apply general rate limiter to all routes
const { generalLimiter } = require('./middleware/RateLimiter/index');
app.use(generalLimiter);

// Parse incoming JSON request bodies( this lets me read req.body.)
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES---I mount each route group on a base path. This keeps the code organized —
//  all auth logic lives in one file, all offer logic in another.
// ============================================

const authRoutes  = require('./routes/Authentication/index');
const offerRoutes = require('./routes/Offers/index');
const swapRoutes  = require('./routes/SwapRequest/index');
const userRoutes  = require('./routes/Users/index');

app.use('/api/auth',   authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/offers', swapRoutes);
app.use('/api/users',  userRoutes);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: '✅ SkillSwap API is running' });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SkillSwap server running on port ${PORT}`);
});