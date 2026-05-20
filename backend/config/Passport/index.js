// config/Passport/index.js — Passport.js Google OAuth strategy
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { googleAuth, generateToken } = require('../../controllers/AuthController/index');
require('dotenv').config();

const callbackURL = process.env.NODE_ENV === 'production'
  ? 'https://skillswap-pumw.onrender.com/api/auth/google/callback'
  : 'http://localhost:5000/api/auth/google/callback';

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL
}, googleAuth));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = { passport, generateToken };