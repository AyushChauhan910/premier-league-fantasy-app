const starPlayerPrices = {
  'Erling Haaland': 13.5,
  'Mohamed Salah': 14.0,
  'Bukayo Saka': 11.0,
  'Cole Palmer': 10.5,
  'Alexander Isak': 10.0,
  'Phil Foden': 9.5,
  'Martin Odegaard': 9.5,
  'Jarrod Bowen': 8.5,
  'William Saliba': 6.0,
  'Eberechi Eze': 7.5,
  'Morgan Rogers': 7.0
};


function getInitialPlayerPrice(player, positionEnum) {
  // Star player override
  if (starPlayerPrices[player.name]) {
    return starPlayerPrices[player.name];
  }

  // Base price by position
  const basePrices = { GK: 5.0, DEF: 5.0, MID: 6.5, FWD: 7.0 };

  // Slightly boost for big-6 teams
  const bigSix = ['Manchester City', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester United', 'Tottenham Hotspur'];
  let price = basePrices[positionEnum] || 5.0;
  if (bigSix.includes(player.team)) price += 0.5;

  // Further adjust for recent goal/assist stats if available (optional)
  if (player.goals && player.goals > 10) price += 0.5;
  if (player.assists && player.assists > 10) price += 0.3;

  // Round to nearest 0.5 for FPL realism
  return Math.round(price * 2) / 2;
}

module.exports = { getInitialPlayerPrice };
