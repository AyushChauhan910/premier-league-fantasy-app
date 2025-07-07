const leagueMembershipModel = require('../models/leagueMembershipModel');
const leagueModel = require('../models/leagueModel');

exports.getMyLeagues = async (req, res) => {
  const userId = req.user.userId;
  try {
    const leagues = await leagueMembershipModel.getLeaguesForUser(userId);
    res.json(leagues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createLeague = async (req, res) => {
  const { name, isPublic } = req.body;
  const adminUserId = req.user.userId;
  // Generate a unique league code (simple example)
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    const league = await leagueModel.createLeague({ name, code, adminUserId, isPublic: !!isPublic });
    // Add creator as a member
    await leagueMembershipModel.joinLeague({ leagueId: league.id, userId: adminUserId });
    res.status(201).json(league);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.joinLeagueByCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId;
  try {
    const league = await leagueModel.getLeagueByCode(code);
    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }
    const membership = await leagueMembershipModel.joinLeague({ leagueId: league.id, userId });
    res.status(200).json({ league, membership });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const db = require('../config/db');

exports.getLeagueLeaderboard = async (req, res) => {
  const leagueId = req.params.leagueId;
  try {
    const result = await db.query(`
      SELECT 
        t.id AS team_id,
        t.team_name,
        u.username,
        COALESCE(SUM(pgs.total_points), 0) AS total_points
      FROM league_memberships lm
      JOIN teams t ON lm.user_id = t.user_id
      JOIN users u ON t.user_id = u.id
      LEFT JOIN team_selections ts ON ts.team_id = t.id
      LEFT JOIN player_gameweek_stats pgs ON ts.player_id = pgs.player_id
      WHERE lm.league_id = $1
      GROUP BY t.id, t.team_name, u.username
      ORDER BY total_points DESC NULLS LAST
    `, [leagueId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};