const db = require('../config/db');

const getMatchesByGameweek = async (gameweekId) => {
  const result = await db.query(
    `SELECT * FROM matches WHERE gameweek_id = $1 ORDER BY match_date`,
    [gameweekId]
  );
  return result.rows;
};

const upsertMatch = async (match) => {
  const result = await db.query(
    `INSERT INTO matches (api_id, gameweek_id, home_team, away_team, home_score, away_score, match_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (api_id) DO UPDATE SET
       home_score = EXCLUDED.home_score,
       away_score = EXCLUDED.away_score,
       status = EXCLUDED.status,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [match.api_id, match.gameweek_id, match.home_team, match.away_team, match.home_score, match.away_score, match.match_date, match.status]
  );
  return result.rows[0];
};

module.exports = { getMatchesByGameweek, upsertMatch };
