// middleware/upload.js — File upload middleware
// Uses Multer + Cloudinary storage for image uploads
// Import this and use upload.single('photo') on any route that accepts an image

const multer  = require('multer');
const { storage } = require('../config/Cloudinary');

const upload = multer({ storage });

module.exports = upload;
