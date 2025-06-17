const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');

// Example: Replace with your actual user model or database logic
const users = []; // In-memory for demonstration

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  // Check if user exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Store user
  users.push({ username, password: hashedPassword });
  console.log(users)
  res.status(201).json({ message: 'User registered successfully!' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  // Replace 'your_jwt_secret_key' with process.env.JWT_SECRET in production
  const token = jwt.sign({ username }, 'ayush0910', { expiresIn: '1h' });
  res.json({ token });
});

router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router
