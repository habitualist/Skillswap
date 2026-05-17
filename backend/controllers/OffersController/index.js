// controllers/OffersController/index.js
const pool = require('../../config/DatabaseConnection/index');

// ============================================
// GET ALL OFFERS
// GET /api/offers
// Supports ?level= and ?format= filters
// ============================================

const getAllOffers = async (req, res) => {
  const { level, format } = req.query;

  try {
    let query = `
      SELECT 
        o.*,
        u.name AS author_name,
        COUNT(sr.id) AS swap_request_count
      FROM offers o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN swap_requests sr ON sr.offer_id = o.id
    `;

    const values = [];
    const conditions = [];

    if (level) {
      values.push(level);
      conditions.push(`o.level = $${values.length}`);
    }

    if (format) {
      values.push(format);
      conditions.push(`o.format = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY o.id, u.name ORDER BY o.created_at DESC';

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);

  } catch (err) {
    console.error('Get all offers error:', err.message);
    res.status(500).json({ error: 'Server error fetching offers.' });
  }
};

// ============================================
// SEARCH OFFERS
// GET /api/offers/search?q=keyword
// ============================================

const searchOffers = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required.' });
  }

  try {
    const result = await pool.query(
      `SELECT 
        o.*,
        u.name AS author_name,
        COUNT(sr.id) AS swap_request_count
      FROM offers o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN swap_requests sr ON sr.offer_id = o.id
      WHERE 
        o.offering_skill ILIKE $1 OR
        o.seeking_skill ILIKE $1 OR
        o.description ILIKE $1
      GROUP BY o.id, u.name
      ORDER BY o.created_at DESC`,
      [`%${q}%`]
    );

    res.status(200).json({
      query: q,
      count: result.rows.length,
      results: result.rows
    });

  } catch (err) {
    console.error('Search offers error:', err.message);
    res.status(500).json({ error: 'Server error during search.' });
  }
};

// ============================================
// GET SINGLE OFFER
// GET /api/offers/:id
// ============================================

const getOfferById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        o.*,
        u.name AS author_name,
        COUNT(sr.id) AS swap_request_count
      FROM offers o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN swap_requests sr ON sr.offer_id = o.id
      WHERE o.id = $1
      GROUP BY o.id, u.name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('Get offer error:', err.message);
    res.status(500).json({ error: 'Server error fetching offer.' });
  }
};

// ============================================
// CREATE OFFER
// POST /api/offers
// Requires authentication
// ============================================

const createOffer = async (req, res) => {
  const { offering_skill, seeking_skill, level, format, description } = req.body;
  const user_id = req.user.id;
  const photo_url = req.file ? req.file.path : null;

  try {
    // Validate required fields
    if (!offering_skill || !seeking_skill) {
      return res.status(400).json({ 
        error: 'Offering skill and seeking skill are required.' 
      });
    }

    const result = await pool.query(
      `INSERT INTO offers 
        (user_id, offering_skill, seeking_skill, level, format, description, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, offering_skill, seeking_skill, level, format, description, photo_url]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Create offer error:', err.message);
    res.status(500).json({ error: 'Server error creating offer.' });
  }
};

// ============================================
// UPDATE OFFER
// PUT /api/offers/:id
// Owner only
// ============================================

const updateOffer = async (req, res) => {
  const { id } = req.params;
  const { offering_skill, seeking_skill, level, format, description } = req.body;
  const user_id = req.user.id;

  try {
    // Check offer exists and belongs to user
    const offer = await pool.query(
      'SELECT * FROM offers WHERE id = $1',
      [id]
    );

    if (offer.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    if (offer.rows[0].user_id !== user_id) {
      return res.status(403).json({ error: 'You can only edit your own offers.' });
    }

    const result = await pool.query(
      `UPDATE offers SET
        offering_skill = COALESCE($1, offering_skill),
        seeking_skill  = COALESCE($2, seeking_skill),
        level          = COALESCE($3, level),
        format         = COALESCE($4, format),
        description    = COALESCE($5, description)
       WHERE id = $6
       RETURNING *`,
      [offering_skill, seeking_skill, level, format, description, id]
    );

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('Update offer error:', err.message);
    res.status(500).json({ error: 'Server error updating offer.' });
  }
};

// ============================================
// DELETE OFFER
// DELETE /api/offers/:id
// Owner only
// ============================================

const deleteOffer = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Check offer exists and belongs to user
    const offer = await pool.query(
      'SELECT * FROM offers WHERE id = $1',
      [id]
    );

    if (offer.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    if (offer.rows[0].user_id !== user_id) {
      return res.status(403).json({ error: 'You can only delete your own offers.' });
    }

    await pool.query('DELETE FROM offers WHERE id = $1', [id]);

    res.status(200).json({ message: 'Offer deleted successfully.' });

  } catch (err) {
    console.error('Delete offer error:', err.message);
    res.status(500).json({ error: 'Server error deleting offer.' });
  }
};

// ============================================
// TOGGLE MATCHED STATUS
// PATCH /api/offers/:id/match
// Owner only
// ============================================

const toggleMatch = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Check offer exists and belongs to user
    const offer = await pool.query(
      'SELECT * FROM offers WHERE id = $1',
      [id]
    );

    if (offer.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    if (offer.rows[0].user_id !== user_id) {
      return res.status(403).json({ error: 'You can only update your own offers.' });
    }

    // Flip the is_matched boolean
    const result = await pool.query(
      `UPDATE offers SET is_matched = NOT is_matched 
       WHERE id = $1 RETURNING *`,
      [id]
    );

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('Toggle match error:', err.message);
    res.status(500).json({ error: 'Server error toggling match status.' });
  }
};

module.exports = {
  getAllOffers,
  searchOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleMatch
};