const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get user by email (instead of username)
async function getUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// Create user with all required fields
async function createUser(email, username, password_hash) {
  await pool.query(
    'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3)',
    [email, username, password_hash]
  );
}

// Get user by ID remains the same
async function getUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

module.exports = { 
  getUserByEmail,  // Changed from getUserByUsername
  createUser, 
  getUserById 
};
