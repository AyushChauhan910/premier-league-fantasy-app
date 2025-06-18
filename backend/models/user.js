// backend/models/user.js
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getUserByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

async function createUser(username, password_hash) {
  await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
    [username, password_hash]
  );
}

async function getUserById(id) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

module.exports = { getUserByUsername, createUser, getUserById };

