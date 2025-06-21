const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const rateLimiter = require('../middleware/rateLimiter');
router.get('/', rateLimiter, playerController.getPlayers);


// Get all players
router.get('/', playerController.getPlayers);

module.exports = router;
