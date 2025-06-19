const teamModel = require('../models/teamModel');

exports.createTeam = async (req, res) => {
  const { teamName } = req.body;
  const userId = req.user.userId;
  try {
    const team = await teamModel.createTeam({ userId, teamName, budgetRemaining: 100.00 });
    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserTeams = async (req, res) => {
  const userId = req.user.userId;
  try {
    const teams = await teamModel.getTeamsByUser(userId);
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
