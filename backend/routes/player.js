const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const rateLimiter = require('../middleware/rateLimiter');
const { fetchPlayers } = require('../services/footballDataService');
const db = require('../config/db');

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

// Get season stats and total points for a player
router.get('/:id/stats', async (req, res) => {
  const playerId = req.params.id;
  try {
    // Sum up total points and aggregate season stats
    const result = await db.query(`
      SELECT 
        player_id,
        SUM(total_points) as total_points,
        SUM(goals) as goals,
        SUM(assists) as assists,
        SUM(minutes_played) as minutes_played,
        SUM(clean_sheet) as clean_sheet,
        SUM(yellow_cards) as yellow_cards,
        SUM(red_cards) as red_cards,
        SUM(own_goals) as own_goals,
        SUM(penalties_saved) as penalties_saved,
        SUM(penalties_missed) as penalties_missed,
        SUM(bonus_points) as bonus_points
      FROM player_gameweek_stats
      WHERE player_id = $1
      GROUP BY player_id
    `, [playerId]);
    if (result.rows.length === 0) return res.status(404).json({ message: "No stats for this player" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
