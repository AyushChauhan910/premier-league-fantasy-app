const db = require('../config/db');

const createTeam = async ({ userId, teamName, budgetRemaining }) => {
  const result = await db.query(
    `INSERT INTO teams (user_id, team_name, budget_remaining)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, teamName, budgetRemaining]
  );
  return result.rows[0];
};

const getTeamsByUser = async (userId) => {
  const result = await db.query(
    `SELECT * FROM teams WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
};

module.exports = { createTeam, getTeamsByUser };
