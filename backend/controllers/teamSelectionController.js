const teamSelectionModel = require('../models/teamSelectionModel');

exports.addPlayerToTeam = async (req, res) => {
  const { teamId, playerId, isCaptain, isViceCaptain, isPlaying, positionInTeam } = req.body;
  try {
    const selection = await teamSelectionModel.addPlayerToTeam({
      teamId,
      playerId,
      isCaptain: !!isCaptain,
      isViceCaptain: !!isViceCaptain,
      isPlaying: isPlaying !== undefined ? !!isPlaying : true,
      positionInTeam
    });
    res.status(201).json(selection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeamPlayers = async (req, res) => {
  const { teamId } = req.params;
  try {
    const players = await teamSelectionModel.getTeamSelection(teamId);
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
