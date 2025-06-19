const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateJWT = require('../middleware/authenticateJWT');
const userModel = require('../models/user.js');

// Registration Route (updated for email/username)
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;  // Added email
  
  try {
    // Check if email exists
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user with email and username
    await userModel.createUser(email, username, hashedPassword);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login Route (updated for email)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;  // Changed to email
  
  try {
    // Fetch user by email
    const user = await userModel.getUserByEmail(email);
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
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route remains unchanged
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

// Get User by ID remains unchanged
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
