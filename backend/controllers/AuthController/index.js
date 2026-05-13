// controllers/AuthController — Authentication logic
const pool = require('../../config/DatabaseConnection/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper function to generate a JWT token
// We reuse this in both register, login and Google OAuth
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

// ============================================
// REGISTER
// POST /api/auth/register
// ============================================

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    // 2. Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // 3. Hash the password — never store plain passwords
    // 10 is the salt rounds — higher = more secure but slower
    const password_hash = await bcrypt.hash(password, 10);

    // 4. Save the new user to the database
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password_hash]
    );

    const newUser = result.rows[0];

    // 5. Generate JWT token
    const token = generateToken(newUser);

    // 6. Return token and user info
    res.status(201).json({ token, user: newUser });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

// ============================================
// LOGIN
// POST /api/auth/login
// ============================================

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check all fields are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    // 3. If no user found with that email
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // 4. If user signed up with Google they have no password
    if (!user.password_hash) {
      return res.status(400).json({ error: 'Please sign in with Google.' });
    }

    // 5. Compare provided password with stored hash
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // 6. Generate JWT token
    const token = generateToken(user);

    // 7. Return token and user info (never return password_hash)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

module.exports = { register, login, generateToken };