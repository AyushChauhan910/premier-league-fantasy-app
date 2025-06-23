const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const rateLimiter = require('../middleware/rateLimiter');
const { fetchPlayers } = require('../services/footballDataService');


router.get('/', rateLimiter, playerController.getPlayers);
// Test route to check cache logs
router.get('/test-api', async (req, res) => {
  try {
    const data = await fetchPlayers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
