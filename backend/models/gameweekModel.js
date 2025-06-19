const db = require('../config/db');

const getCurrentGameweek = async () => {
  const result = await db.query(
    `SELECT * FROM gameweeks WHERE is_current = TRUE LIMIT 1`
  );
  return result.rows[0];
};

const getAllGameweeks = async () => {
  const result = await db.query(
    `SELECT * FROM gameweeks ORDER BY gameweek_number`
  );
  return result.rows;
};

module.exports = { getCurrentGameweek, getAllGameweeks };
