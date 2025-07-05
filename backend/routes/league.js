const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const leagueController = require('../controllers/leagueMembershipController');

// Get all leagues the current user is a member of
router.get('/my', authenticateJWT, leagueController.getMyLeagues);
router.post('/', authenticateJWT, leagueController.createLeague);

module.exports = router;
