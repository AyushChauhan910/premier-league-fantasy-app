const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const apiCache = new NodeCache({ stdTTL: process.env.CACHE_TTL ? Number(process.env.CACHE_TTL) / 1000 : 300 }); // Default 5 min
const API_URL = process.env.FOOTBALL_DATA_API_URL || 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

const fetchWithCache = async (key, endpoint) => {
  const cachedData = apiCache.get(key);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    apiCache.set(key, response.data);
    return response.data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw new Error('Failed to fetch data from Football-Data API');
  }
};

const fetchPlayers = async () => fetchWithCache('players', '/competitions/PL/teams');
const fetchFixtures = async () => fetchWithCache('fixtures', '/competitions/PL/matches');

module.exports = { fetchPlayers, fetchFixtures };
