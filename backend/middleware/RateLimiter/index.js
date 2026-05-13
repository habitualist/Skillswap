// middleware/rateLimiter.js — Rate limiting middleware
// Prevents abuse by capping requests per IP address
// Uses express-rate-limit (already installed)

const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100,                  // max 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' }
});

module.exports = rateLimiter;
