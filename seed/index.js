// seed.js — Populates the database with realistic test data
// Run with: node seed.js

const pool = require('../backend/config/DatabaseConnection/index');
const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    console.log('🌱 Starting seed...');

    // ============================================
    // CLEAR EXISTING DATA
    // ============================================
    await pool.query('DELETE FROM swap_requests');
    await pool.query('DELETE FROM offers');
    await pool.query('DELETE FROM users');

    // Reset auto-increment sequences
    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE offers_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE swap_requests_id_seq RESTART WITH 1');

    console.log('✅ Cleared existing data');

    // ============================================
    // CREATE USERS
    // ============================================
    const password = await bcrypt.hash('password123', 10);

    const users = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES
        ('Alex Johnson', 'alex@skillswap.com', $1),
        ('Maria Santos', 'maria@skillswap.com', $1),
        ('David Chen', 'david@skillswap.com', $1)
       RETURNING id, name`,
      [password]
    );

    const [alex, maria, david] = users.rows;
    console.log(`✅ Created ${users.rows.length} users`);

    // ============================================
    // CREATE OFFERS
    // ============================================
    const offers = await pool.query(
      `INSERT INTO offers (user_id, offering_skill, seeking_skill, level, format, description) VALUES
        ($1, 'React', 'Figma', 'Intermediate', 'Video Call', 
         'I have 3 years of React experience and can teach you hooks, context, and component architecture. Looking to improve my UI design skills in Figma.'),
        
        ($1, 'Node.js & Express', 'Spanish', 'Intermediate', 'Async', 
         'Backend developer with strong Node.js skills. Can teach REST API design, middleware, and authentication. Want to learn conversational Spanish.'),
        
        ($1, 'Python', 'Guitar', 'Beginner', 'Video Call', 
         'Python developer comfortable with data structures and scripting. Happy to teach beginners. Always wanted to learn to play guitar.'),

        ($2, 'Spanish', 'React', 'Expert', 'Video Call', 
         'Native Spanish speaker, fluent in both Castilian and Latin American Spanish. Looking to learn modern React development.'),

        ($2, 'Figma & UI Design', 'Node.js', 'Expert', 'Async', 
         'Professional UI/UX designer with 5 years experience. Can teach design systems, prototyping, and user research. Want to learn backend development.'),

        ($2, 'Graphic Design', 'Python', 'Intermediate', 'In-person', 
         'Skilled in Adobe Suite and brand identity design. Looking to automate repetitive design tasks with Python scripting.'),

        ($3, 'Guitar', 'Photography', 'Intermediate', 'Video Call', 
         'Self-taught guitarist with 6 years experience. Can teach chords, fingerpicking, and music theory basics. Want to learn portrait photography.'),

        ($3, 'Photography', 'Spanish', 'Intermediate', 'Async', 
         'Landscape and portrait photographer. Can teach composition, lighting, and photo editing in Lightroom. Want to improve my Spanish.'),

        ($3, 'Data Science', 'Figma', 'Expert', 'Video Call', 
         'Data scientist with expertise in pandas, matplotlib, and machine learning. Looking to improve my product design skills.'),

        ($3, 'DevOps & Docker', 'React', 'Intermediate', 'Async', 
         'DevOps engineer comfortable with Docker, CI/CD pipelines, and cloud deployment. Want to learn modern frontend development.')
       RETURNING id`,
      [alex.id, maria.id, david.id]
    );

    console.log(`✅ Created ${offers.rows.length} offers`);

    // ============================================
    // CREATE SWAP REQUESTS
    // ============================================
    await pool.query(
      `INSERT INTO swap_requests (offer_id, sender_id, message) VALUES
        (1, $2, 'Hi Alex! I am a professional UI designer and would love to swap skills. I can teach you Figma from scratch!'),
        (1, $3, 'Hey! I have been using Figma for 2 years and would love to learn React. Let me know if you are interested!'),
        
        (2, $2, 'Hola Alex! I am a native Spanish speaker and would love to learn Node.js from you. Perfect match!'),
        (2, $3, 'Hi! I speak Spanish fluently and have been wanting to learn backend development. This is perfect!'),

        (4, $1, 'Hi Maria! I know React very well and would love to practice my Spanish with a native speaker!'),
        (4, $3, 'Hello! I am a React developer looking to improve my Spanish. Would love to connect!'),

        (5, $1, 'Hi Maria! I am a Node.js developer and would love to learn Figma from a professional designer.'),
        (5, $3, 'Hey Maria! I can teach you Node.js and Express in exchange for some Figma lessons!'),

        (7, $1, 'Hi David! I have always wanted to learn guitar. I can teach you some React in exchange!'),
        (7, $2, 'Hey! I am a photographer and would love to learn guitar. Happy to teach you photography too!')
       RETURNING id`,
      [alex.id, maria.id, david.id]
    );

    console.log(`✅ Created swap requests`);
    console.log('');
    console.log('🎉 Seed complete! Database populated with:');
    console.log('   - 3 users (alex, maria, david) — password: password123');
    console.log('   - 10 skill offers across different skills');
    console.log('   - 10 swap requests across offers');
    console.log('');
    console.log('Login with any of these emails + password123');

    process.exit(0);

  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();