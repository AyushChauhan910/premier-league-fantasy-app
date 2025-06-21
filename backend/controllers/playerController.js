const { fetchPlayers } = require('../services/footballDataService');
const playerModel = require('../models/playerModel');

exports.getPlayers = async (req, res) => {
  try {
    const players = await playerModel.getAllPlayers();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
