const db = require('../config/db');

async function getGameweekIdForDate(matchDate) {
  // Convert matchDate to a Date object if necessary
  const date = new Date(matchDate);

  // Find the latest gameweek whose deadline is after the match date
  // (or adjust logic if you want the first deadline after the match)
  const result = await db.query(
    `SELECT id FROM gameweeks WHERE deadline > $1 ORDER BY deadline ASC LIMIT 1`,
    [date]
  );
  if (result.rows.length > 0) {
    return result.rows[0].id;
  } else {
    // If no future gameweek, get the last one (end of season)
    const fallback = await db.query(
      `SELECT id FROM gameweeks ORDER BY deadline DESC LIMIT 1`
    );
    return fallback.rows.length > 0 ? fallback.rows[0].id : null;
  }
}

module.exports = { getGameweekIdForDate };
