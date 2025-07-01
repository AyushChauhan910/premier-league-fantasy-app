// server.js
require('dotenv').config(); // Load environment variables from .env file
require('./services/dataUpdater'); // Start background job


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const app = express();
const authenticateJWT = require('./middleware/authenticateJWT');
const logger = require('./logger');
const db = require('./config/db');  // Ensure you export pool from db.js
const teamRoutes = require('./routes/team');
const playerRoutes = require('./routes/player');
const teamSelectionRoutes = require('./routes/teamSelection');
const { runSync } = require('./services/dataUpdater');
const { fetchPlayers } = require('./services/footballDataService');


process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Use Helmet to set secure HTTP headers
app.use(helmet());

// Enable CORS for all origins (customize later)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Basic logging middleware for incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rate limiting middleware configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});

// Apply rate limiting to all requests
app.use(limiter);

// Basic test route
app.get('/', (req, res) => {
  res.send('Premier League Fantasy Football API is running.');
});

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {  // Capture server instance
  console.log(`Server listening on port ${PORT}`);
});

app.use('/api', authRoutes);
app.use('/dashboard', authenticateJWT);
// Protected route
app.get('/dashboard', authenticateJWT, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}! This is your dashboard.` });
});

app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/team-selections', teamSelectionRoutes);

app.get('/manual-sync', async (req, res) => {
  try {
    const result = await runSync();
    res.json({ 
      status: 'success',
      message: 'Manual sync completed successfully',
      details: result
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Manual sync failed',
      error: err.message
    });
  }
});

app.get('/debug-players', async (req, res) => {
  try {
    const data = await fetchPlayers();
    // Return the first team and its squad as a sample
    res.json(data.teams.map(team => ({
      team: team.name,
      squad: team.squad.map(player => ({
        id: player.id,
        name: player.name,
        position: player.position
      }))
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const shutdown = () => {
  logger.info('Shutting down server...');
  server.close(() => {
    logger.info('HTTP server closed.');
    db.pool.end(() => {
      logger.info('PostgreSQL pool has ended.');
      process.exit(0);
    });
  });
  // Force shutdown if not closed in 10 seconds
  setTimeout(() => {
    logger.error('Forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

