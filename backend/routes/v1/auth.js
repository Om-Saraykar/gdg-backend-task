// routes/auth.js
const router = require('express').Router();
const passport = require('passport');
const User = require('./../../models/v1/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc   Auth with Google
// @route  GET /api/auth/google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// @desc   Google auth callback
// @route  GET /api/auth/google/callback
router.get('/google/callback', passport.authenticate('google'), async (req, res) => {
  try {
    // Check if the user exists based on googleId
    let user = await User.findOne({ googleId: req.user.id });
    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        username: req.user.displayName, // or whatever you want to use as username
        email: req.user.emails[0].value,
        googleId: req.user.id
      });
      await user.save();
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`http://localhost:5173?token=${token}`); // Redirect to your frontend with the token
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @desc   Logout user
// @route  GET /api/auth/logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/'); // Redirect after logout
});

// @desc   Login with email and password
// @route  POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token }); // Send the token back to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @desc   Register new user
// @route  POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    
    // Optionally, you might want to send back the user data or just a success message
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
