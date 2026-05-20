// routes/Authentication/index.js — Auth routes
const express    = require('express');
const router     = express.Router();
const { register, login } = require('../../controllers/AuthController/index');
const { passport, generateToken } = require('../../config/Passport/index');
const { registerLimiter, loginLimiter } = require('../../middleware/RateLimiter/index');

// Initialize passport
router.use(passport.initialize());

// POST /api/auth/register
router.post('/register', registerLimiter, register);

// POST /api/auth/login
router.post('/login', loginLimiter, login);

// GET /api/auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    const frontendUrl = process.env.NODE_ENV === 'production'
      ? 'https://skillswap-sable-xi.vercel.app'
      : 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
);

module.exports = router;