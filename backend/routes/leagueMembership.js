const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const leagueMembershipController = require('../controllers/leagueMembershipController');

// Join a league by code
router.post('/join', authenticateJWT, leagueMembershipController.joinLeagueByCode);

module.exports = router;
