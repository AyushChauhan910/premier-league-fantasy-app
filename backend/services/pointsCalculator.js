// services/pointsCalculator.js

const db = require('../config/db');
const { upsertPlayerGameweekStats } = require('../models/playerGameweekStatsModel');

// Scoring rules (customize as needed)
const SCORING = {
  GK: { goal: 6, assist: 3, cleanSheet: 4, save: 1/3, penSave: 5, penMiss: -2, yellow: -1, red: -3, ownGoal: -2, played60: 2 },
  DEF: { goal: 6, assist: 3, cleanSheet: 4, yellow: -1, red: -3, ownGoal: -2, played60: 2 },
  MID: { goal: 5, assist: 3, cleanSheet: 1, yellow: -1, red: -3, ownGoal: -2, played60: 2 },
  FWD: { goal: 4, assist: 3, cleanSheet: 0, yellow: -1, red: -3, ownGoal: -2, played60: 2 },
};

function calculatePoints(stats, position) {
  const rules = SCORING[position] || SCORING.FWD;
  let points = 0;
  points += (stats.goals || 0) * rules.goal;
  points += (stats.assists || 0) * rules.assist;
  points += (stats.clean_sheet ? rules.cleanSheet : 0);
  points += (stats.saves && rules.save ? Math.floor(stats.saves / 3) * rules.save : 0);
  points += (stats.penalties_saved || 0) * (rules.penSave || 0);
  points += (stats.penalties_missed || 0) * (rules.penMiss || 0);
  points += (stats.yellow_cards || 0) * rules.yellow;
  points += (stats.red_cards || 0) * rules.red;
  points += (stats.own_goals || 0) * rules.ownGoal;
  points += (stats.minutes_played && stats.minutes_played >= 60 ? rules.played60 : 0);
  points += (stats.bonus_points || 0);
  return Math.round(points);
}

async function processCompletedMatches() {
  // 1. Get all finished matches
  const matchRes = await db.query(
    `SELECT * FROM matches WHERE status = 'finished'`
  );
  const matches = matchRes.rows;

  for (const match of matches) {
    // 2. For each match, get all player stats for that match
    const statsRes = await db.query(
      `SELECT * FROM player_gameweek_stats WHERE match_id = $1`,
      [match.id]
    );
    for (const stats of statsRes.rows) {
      // 3. Get player position
      const playerRes = await db.query(
        `SELECT position FROM players WHERE id = $1`,
        [stats.player_id]
      );
      const position = playerRes.rows[0]?.position || 'FWD';
      // 4. Calculate points
      const total_points = calculatePoints(stats, position);
      // 5. Update player_gameweek_stats
      await upsertPlayerGameweekStats({ ...stats, total_points });
    }
  }
  console.log("[Points Calculator] Processed points for all finished matches.");
}

module.exports = { processCompletedMatches };
