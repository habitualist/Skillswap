// middleware/RateLimiter/index.js — Rate limiting middleware
const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { error: 'Too many requests. Please try again later.' }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  validate: { xForwardedForHeader: false },
  message: { error: 'Too many registration attempts. Please try again later.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  validate: { xForwardedForHeader: false },
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});

const createOfferLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  keyGenerator: (req) => String(req.user?.id ?? req.ip),
  message: { error: 'You have created too many offers. Please wait before posting again.' }
});

const swapRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
  keyGenerator: (req) => String(req.user?.id ?? req.ip),
  message: { error: 'You have sent too many swap requests. Please wait before sending more.' }
});

module.exports = {
  generalLimiter,
  registerLimiter,
  loginLimiter,
  createOfferLimiter,
  swapRequestLimiter
};