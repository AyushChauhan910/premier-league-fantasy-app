const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 8, // Allow 8 requests per minute (below 10 call limit)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests - please try again later'
  }
});

module.exports = apiLimiter;

