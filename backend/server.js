// server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const app = express();
const authenticateJWT = require('./middleware/authenticateJWT');

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
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.use('/', authRoutes);

app.get('/dashboard', authenticateJWT, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!` });
});

// Example: Protect multiple routes
app.get('/profile', authenticateJWT, (req, res) => {
  // Only accessible with valid JWT
});

app.post('/team', authenticateJWT, (req, res) => {
  // Only accessible with valid JWT
});

