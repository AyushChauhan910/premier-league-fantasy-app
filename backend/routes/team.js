const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const teamController = require('../controllers/teamController');

// Create a new team
router.post('/', authenticateJWT, teamController.createTeam);

// Get all teams for a user
router.get('/', authenticateJWT, teamController.getUserTeams);

module.exports = router;
