// routes/SwapRequest/index.js — Swap request routes
const express     = require('express');
const router      = express.Router();
const verifyToken = require('../../middleware/JwtVerifier/index');
const { swapRequestLimiter } = require('../../middleware/RateLimiter/index');
const { sendSwapRequest, getSwapRequests } = require('../../controllers/SwapRequestController/index');

// POST /api/offers/:id/request — Send a swap request
router.post('/:id/request', verifyToken, swapRequestLimiter, sendSwapRequest);

// GET /api/offers/:id/requests — View requests on an offer (owner only)
router.get('/:id/requests', verifyToken, getSwapRequests);

module.exports = router;