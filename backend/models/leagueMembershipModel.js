const db = require('../config/db');

const joinLeague = async ({ leagueId, userId }) => {
  const result = await db.query(
    `INSERT INTO league_memberships (league_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (league_id, user_id) DO NOTHING
     RETURNING *`,
    [leagueId, userId]
  );
  return result.rows[0];
};

const getLeaguesForUser = async (userId) => {
  const result = await db.query(
    `SELECT l.* FROM leagues l
     JOIN league_memberships lm ON l.id = lm.league_id
     WHERE lm.user_id = $1`,
    [userId]
  );
  return result.rows;
};

module.exports = { joinLeague, getLeaguesForUser };
