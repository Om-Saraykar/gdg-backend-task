const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const redis = require('redis');
const passport = require('passport');
const session = require('cookie-session');
require('dotenv').config();
require('./config/passport-setup');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Redis client setup
const redisClient = redis.createClient(); 

// Connect to Redis
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Error handling for Redis
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Auth routes
const authRoutes = require('./routes/v1/auth');
app.use('/api/auth', authRoutes);

// Movie routes for version 1
const movieRoutesV1 = require('./routes/v1/movies');
app.use('/api/v1/movies', movieRoutesV1);

// Movie routes for version 2
const movieRoutesV2 = require('./routes/v2/movies');
app.use('/api/v2/movies', movieRoutesV2);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Session management with cookie-session
app.use(session({
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  keys: [process.env.JWT_SECRET],
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
