const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Get all players
router.get('/', playerController.getPlayers);

module.exports = router;
