// middleware/auth.js — JWT verification middleware
// This function runs BEFORE any protected route handler
// It checks the token and attaches the user to req.user

const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {

  // Get the token from the Authorization header
  // The header looks like: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get part after "Bearer "

  // If no token was provided at all
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using our JWT_SECRET from .env
    // If the token is fake or expired this will throw an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request
    // Now any route handler can access req.user.id
    req.user = decoded;

    next(); // Move on to the actual route handler

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;