const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const userModel = require('../models/user.js');

// Registration Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user exists in PostgreSQL
    const existingUser = await userModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store user in PostgreSQL
    await userModel.createUser(username, hashedPassword);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
        console.error('🔥 Full error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }

});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Fetch user from PostgreSQL
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Route Example
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Get User by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
