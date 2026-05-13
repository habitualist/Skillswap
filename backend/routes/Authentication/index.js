// routes/Authentication/index.js — Auth routes
const express    = require('express');
const router     = express.Router();
const { register, login } = require('../../controllers/AuthController/index');
const rateLimiter = require('../../middleware/RateLimiter/index');

// POST /api/auth/register
router.post('/register', rateLimiter, register);

// POST /api/auth/login
router.post('/login', rateLimiter, login);

module.exports = router;