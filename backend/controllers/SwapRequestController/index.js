// controllers/SwapRequestController/index.js
const pool = require('../../config/DatabaseConnection/index');

// ============================================
// SEND SWAP REQUEST
// POST /api/offers/:id/request
// Requires authentication
// ============================================

const sendSwapRequest = async (req, res) => {
  const { id } = req.params;
  const sender_id = req.user.id;
  const { message } = req.body;

  try {
    // 1. Check message is provided
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // 2. Find the offer
    const offer = await pool.query(
      'SELECT * FROM offers WHERE id = $1',
      [id]
    );

    if (offer.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    // 3. Block self-requests
    if (offer.rows[0].user_id === sender_id) {
      return res.status(400).json({ 
        error: 'You cannot send a swap request to your own offer.' 
      });
    }

    // 4. Block requests to matched offers
    if (offer.rows[0].is_matched) {
      return res.status(400).json({ 
        error: 'This offer has already been matched.' 
      });
    }

    // 5. Save swap request
    const result = await pool.query(
      `INSERT INTO swap_requests (offer_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, sender_id, message]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Send swap request error:', err.message);
    res.status(500).json({ error: 'Server error sending swap request.' });
  }
};

// ============================================
// GET SWAP REQUESTS FOR AN OFFER
// GET /api/offers/:id/requests
// Owner only
// ============================================

const getSwapRequests = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // 1. Find the offer
    const offer = await pool.query(
      'SELECT * FROM offers WHERE id = $1',
      [id]
    );

    if (offer.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    // 2. Check ownership
    if (offer.rows[0].user_id !== user_id) {
      return res.status(403).json({ 
        error: 'You can only view requests for your own offers.' 
      });
    }

    // 3. Get all swap requests with sender info
    const result = await pool.query(
      `SELECT 
        sr.*,
        u.name AS sender_name,
        u.email AS sender_email
       FROM swap_requests sr
       JOIN users u ON sr.sender_id = u.id
       WHERE sr.offer_id = $1
       ORDER BY sr.created_at DESC`,
      [id]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error('Get swap requests error:', err.message);
    res.status(500).json({ error: 'Server error fetching swap requests.' });
  }
};

module.exports = { sendSwapRequest, getSwapRequests };