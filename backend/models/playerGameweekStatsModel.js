const db = require('../config/db');

const upsertPlayerGameweekStats = async (stats) => {
  const result = await db.query(
    `INSERT INTO player_gameweek_stats
     (player_id, gameweek_id, match_id, minutes_played, goals, assists, clean_sheet, yellow_cards, red_cards, own_goals, penalties_saved, penalties_missed, saves, bonus_points, total_points)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     ON CONFLICT (player_id, gameweek_id, match_id) DO UPDATE SET
       minutes_played = EXCLUDED.minutes_played,
       goals = EXCLUDED.goals,
       assists = EXCLUDED.assists,
       clean_sheet = EXCLUDED.clean_sheet,
       yellow_cards = EXCLUDED.yellow_cards,
       red_cards = EXCLUDED.red_cards,
       own_goals = EXCLUDED.own_goals,
       penalties_saved = EXCLUDED.penalties_saved,
       penalties_missed = EXCLUDED.penalties_missed,
       saves = EXCLUDED.saves,
       bonus_points = EXCLUDED.bonus_points,
       total_points = EXCLUDED.total_points,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      stats.player_id, stats.gameweek_id, stats.match_id,
      stats.minutes_played, stats.goals, stats.assists, stats.clean_sheet,
      stats.yellow_cards, stats.red_cards, stats.own_goals, stats.penalties_saved,
      stats.penalties_missed, stats.saves, stats.bonus_points, stats.total_points
    ]
  );
  return result.rows[0];
};

module.exports = { upsertPlayerGameweekStats };
