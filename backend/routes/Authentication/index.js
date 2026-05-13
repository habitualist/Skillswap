// routes/Authentication/index.js — Auth routes
const express    = require('express');
const router     = express.Router();
const { register, login } = require('../../controllers/AuthController/index');
const { passport, generateToken } = require('../../config/Passport/index');
const rateLimiter = require('../../middleware/RateLimiter/index');

// Initialize passport
router.use(passport.initialize());

// POST /api/auth/register
router.post('/register', rateLimiter, register);

// POST /api/auth/login
router.post('/login', rateLimiter, login);

// GET /api/auth/google — redirect to Google login page
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// GET /api/auth/google/callback — Google sends user back here
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token for the Google user
    const token = generateToken(req.user);

    // Redirect to frontend with token in URL
    // Frontend will extract it and store in localStorage
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

module.exports = router;