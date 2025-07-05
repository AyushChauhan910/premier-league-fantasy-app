const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const teamSelectionController = require('../controllers/teamSelectionController');

// Add player to team
router.post('/', authenticateJWT, teamSelectionController.addPlayerToTeam);

// Get all players in a team
router.get('/:teamId', authenticateJWT, teamSelectionController.getTeamPlayers);

router.delete('/:teamId/:playerId', authenticateJWT, teamSelectionController.removePlayerFromTeam);

module.exports = router;
