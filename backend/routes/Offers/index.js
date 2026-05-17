// routes/Offers/index.js — Offer routes
const express     = require('express');
const router      = express.Router();
const verifyToken = require('../../middleware/JwtVerifier/index');
const upload      = require('../../middleware/CloudinaryUploads/index');
const { createOfferLimiter } = require('../../middleware/RateLimiter/index');
const {
  getAllOffers,
  searchOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleMatch
} = require('../../controllers/OffersController/index');

// Public routes
router.get('/',        getAllOffers);
router.get('/search',  searchOffers);
router.get('/:id',     getOfferById);

// Protected routes
router.post('/',           verifyToken, createOfferLimiter, upload.single('photo'), createOffer);
router.put('/:id',         verifyToken, updateOffer);
router.delete('/:id',      verifyToken, deleteOffer);
router.patch('/:id/match', verifyToken, toggleMatch);

module.exports = router;