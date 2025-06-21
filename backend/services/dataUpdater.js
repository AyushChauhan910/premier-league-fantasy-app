const cron = require('node-cron');
const { fetchPlayers, fetchFixtures } = require('./footballDataService');
const playerModel = require('../models/playerModel');
const matchModel = require('../models/matchModel');
const { getInitialPlayerPrice } = require('./priceUtils.js');
const db = require('../config/db'); // Add this below other requires
const { getGameweekIdForDate } = require('./gameweekUtils');

console.log('[Background Job] Initializing data updater...');

function mapPositionToEnum(position) {
  if (!position) return 'UNK';
  const pos = position.trim().toLowerCase();

  // Goalkeeper
  if (pos.includes('goalkeeper') || pos === 'gk' || pos === 'keeper') return 'GK';

  // Defenders
  if (
    pos === 'defence' ||
    pos === 'defender' ||
    pos.includes('back') ||
    pos.includes('centre-back') ||
    pos.includes('center-back') ||
    pos.includes('right-back') ||
    pos.includes('left-back') ||
    pos.includes('full-back') ||
    pos.includes('wing-back') ||
    pos === 'cb' || pos === 'rb' || pos === 'lb' || pos === 'sweeper'
  ) return 'DEF';

  // Midfielders
  if (
    pos === 'midfield' ||
    pos === 'midfielder' ||
    pos.includes('midfield') ||
    pos.includes('central midfield') ||
    pos.includes('attacking midfield') ||
    pos.includes('defensive midfield') ||
    pos === 'cm' || pos === 'dm' || pos === 'am' || pos === 'wm'
  ) return 'MID';

  // Forwards / Attackers
  if (
    pos === 'offence' ||
    pos === 'forward' ||
    pos === 'attacker' ||
    pos.includes('forward') ||
    pos.includes('striker') ||
    pos.includes('second striker') ||
    pos.includes('centre-forward') ||
    pos.includes('center-forward') ||
    pos === 'cf' || pos === 'ss' || pos === 'es'
  ) return 'FWD';

  // Wingers (map to Forward)
  if (
    pos.includes('winger') ||
    pos === 'right winger' ||
    pos === 'left winger' ||
    pos === 'rw' ||
    pos === 'lw'
  ) return 'FWD';

  // If nothing matches, return 'UNK'
  return 'UNK';

}



async function updateGameweekStatus() {
  const now = new Date();
  
  try {
    // Reset all current flags
    await db.query('UPDATE gameweeks SET is_current = false');
    
    // Mark finished gameweeks
    await db.query(`
      UPDATE gameweeks 
      SET is_finished = true 
      WHERE deadline < $1
    `, [now]);
    
    // Set current gameweek
    await db.query(`
      UPDATE gameweeks 
      SET is_current = true 
      WHERE id = (
        SELECT id 
        FROM gameweeks 
        WHERE deadline > $1 
        ORDER BY deadline ASC 
        LIMIT 1
      )
    `, [now]);
    
    console.log('[Gameweek Status] Updated current/finished flags');
  } catch (err) {
    console.error('[Gameweek Status] Update failed:', err.message);
    throw err;
  }
}

async function runSync() {
  console.log('[Background Job] Starting manual sync...');
  try {
    // Fetch and upsert players
    const data = await fetchPlayers();
    for (const team of data.teams) {
      for (const player of team.squad) {
        const rawPosition = player.position;
        const mappedPosition = mapPositionToEnum(rawPosition);
        const playerWithTeam = { ...player, team: team.name };
        const price = getInitialPlayerPrice(playerWithTeam, player.position);

        if (mappedPosition === 'UNK') {
          console.log(`Unmapped position: ${rawPosition} (Team: ${team.name})`);
        }

        await playerModel.upsertPlayer({
          api_id: player.id,
          name: player.name,
          position: mappedPosition,
          team: team.name,
          price: price
        });
      }
    }

    // Fetch and upsert fixtures
    const fixtures = await fetchFixtures();
    for (const match of fixtures.matches) {
      console.log('Trying to map match:', match.id, match.utcDate);
      const gameweek_id = await getGameweekIdForDate(match.utcDate);
      console.log('Mapped gameweek_id:', gameweek_id);
      if (!gameweek_id) {
        console.warn(`Skipping match ${match.id}: No gameweek found for ${match.utcDate}`);
        continue;
      }
      try {
        await matchModel.upsertMatch({
          api_id: match.id,
          gameweek_id,
          home_team: match.homeTeam?.name || 'Unknown',
          away_team: match.awayTeam?.name || 'Unknown',
          home_score: (match.score.fullTime.home != null && match.score.fullTime.home >= 0) ? match.score.fullTime.home : null,
          away_score: (match.score.fullTime.away != null && match.score.fullTime.away >= 0) ? match.score.fullTime.away : null,
          match_date: match.utcDate,
          status: match.status ? match.status.toLowerCase() : 'scheduled'
        });
        console.log(`Inserted/updated match ${match.id} in gameweek ${gameweek_id}`);
      } catch (err) {
        console.error(`Failed to upsert match ${match.id}:`, err.message);
      }
      
    }

    await updateGameweekStatus();

    console.log('[Background Job] Manual sync complete');
    return { success: true, message: 'Sync completed successfully' };
  } catch (err) {
    console.error('[Background Job] Manual sync failed:', err.message);
    throw err;
  }

  
}

// Schedule background job (every 6 hours)

cron.schedule('0 */6 * * *', async () => {
  console.log('[Background Job] Scheduled sync starting...');
  try {
    await runSync();
  } catch (err) {
    console.error('[Background Job] Scheduled sync failed:', err.message);
  }
});


// Export for manual triggering
module.exports = { runSync };
