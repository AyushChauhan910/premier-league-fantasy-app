const db = require('../config/db');

const getAllPlayers = async () => {
  const result = await db.query(
    `SELECT * FROM players ORDER BY name`
  );
  return result.rows;
};

const upsertPlayer = async (player) => {
  // Upsert logic for syncing with Football-Data.org
  const result = await db.query(
    `INSERT INTO players (api_id, name, position, team, price)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (api_id) DO UPDATE SET
       name = EXCLUDED.name,
       position = EXCLUDED.position,
       team = EXCLUDED.team,
       price = EXCLUDED.price,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [player.api_id, player.name, player.position, player.team, player.price]
  );
  return result.rows[0];
};

module.exports = { getAllPlayers, upsertPlayer };
