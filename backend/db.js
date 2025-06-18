// db.js
require('dotenv').config();
const { Pool } = require('pg');

// Create a new pool instance using environment variables
const pool = new Pool({
  // Configuration is automatically taken from process.env (PGUSER, PGPASSWORD, etc.)
  // You can override or add more options here if needed
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
});

// Error handling for idle clients in the pool
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // In production, you might want to alert/notify here
  process.exit(-1);
});

// Export pool for use in other modules
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
