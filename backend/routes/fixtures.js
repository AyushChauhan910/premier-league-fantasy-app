// routes/fixtures.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all fixtures, ordered by date
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM matches ORDER BY match_date');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
