const db = require('../config/db');

const createLeague = async ({ name, code, adminUserId, isPublic }) => {
  const result = await db.query(
    `INSERT INTO leagues (name, code, admin_user_id, is_public)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, code, adminUserId, isPublic]
  );
  return result.rows[0];
};

const getLeagueByCode = async (code) => {
  const result = await db.query(
    `SELECT * FROM leagues WHERE code = $1`,
    [code]
  );
  return result.rows[0];
};

module.exports = { createLeague, getLeagueByCode };
