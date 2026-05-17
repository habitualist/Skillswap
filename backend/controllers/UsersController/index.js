// controllers/UsersController/index.js
const pool = require('../../config/DatabaseConnection/index');

// ============================================
// GET USER PROFILE
// GET /api/users/:id
// Public
// ============================================

const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get user info
    const user = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // 2. Get all their offers
    const offers = await pool.query(
      `SELECT 
        o.*,
        COUNT(sr.id) AS swap_request_count
       FROM offers o
       LEFT JOIN swap_requests sr ON sr.offer_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [id]
    );

    res.status(200).json({
      user: user.rows[0],
      offers: offers.rows
    });

  } catch (err) {
    console.error('Get user profile error:', err.message);
    res.status(500).json({ error: 'Server error fetching user profile.' });
  }
};

module.exports = { getUserProfile };