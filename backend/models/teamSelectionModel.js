const db = require('../config/db');

const addPlayerToTeam = async ({ teamId, playerId, isCaptain, isViceCaptain, isPlaying, positionInTeam }) => {
  const result = await db.query(
    `INSERT INTO team_selections
    (team_id, player_id, is_captain, is_vice_captain, is_playing, position_in_team)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (team_id, player_id) DO UPDATE SET
      is_captain = EXCLUDED.is_captain,
      is_vice_captain = EXCLUDED.is_vice_captain,
      is_playing = EXCLUDED.is_playing,
      position_in_team = EXCLUDED.position_in_team
    RETURNING *`,
    [teamId, playerId, isCaptain, isViceCaptain, isPlaying, positionInTeam]
  );
  return result.rows[0];
};

const getTeamSelection = async (teamId) => {
  const result = await db.query(
    `SELECT * FROM team_selections WHERE team_id = $1`,
    [teamId]
  );
  return result.rows;
};



const removePlayerFromTeam = async (teamId, playerId) => {
  await db.query(
    `DELETE FROM team_selections WHERE team_id = $1 AND player_id = $2`,
    [teamId, playerId]
  );
};
module.exports = { addPlayerToTeam, getTeamSelection, removePlayerFromTeam };