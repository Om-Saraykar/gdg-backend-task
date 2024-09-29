const express = require('express');
const router = express.Router();
const Movie = require('../../models/v1/Movie');
const redis = require('redis');
const jwt = require('jsonwebtoken'); // Import jwt

// Create a Redis client
const redisClient = redis.createClient();

// Connect to Redis
redisClient.connect().catch(console.error);

// Middleware to handle Redis connection errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Cache key for movies list
const MOVIES_LIST_CACHE_KEY = 'movies_list_cache_key';

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from headers
  if (!token) {
    return res.sendStatus(403); // Forbidden if no token
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = user; // Attach user info to request
    next();
  });
};

// Apply the authenticateJWT middleware to all movie routes that require authentication
router.use(authenticateJWT);

// Create a new movie
router.post('/', async (req, res) => {
  const { title, genre, rating, releaseDate, runtime } = req.body;

  try {
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists' });
    }

    const newMovie = new Movie({ title, genre, rating, releaseDate, runtime });
    const savedMovie = await newMovie.save();

    // Clear the cache for the movies list after creating a new movie
    await redisClient.del(MOVIES_LIST_CACHE_KEY); // Use the constant here

    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  const { title, genre, year, rating, runtime, sortBy, order } = req.query;

  let filter = {};
  let sort = {};

  // Add filters based on the query parameters provided
  if (title) filter.title = { $regex: title, $options: 'i' };
  if (genre) filter.genre = genre;
  if (year) filter.releaseDate = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };
  if (rating) filter.rating = { $gte: rating };
  if (runtime) filter.runtime = { $gte: runtime };

  // Valid sorting fields
  const validSortFields = ['title', 'genre', 'releaseDate', 'rating', 'runtime'];

  // Sorting logic
  if (sortBy && validSortFields.includes(sortBy)) {
    const sortField = sortBy === 'year' ? 'releaseDate' : sortBy; // Example for remapping
    const sortOrder = order === 'desc' ? -1 : 1; // Default to ascending if order not provided
    sort[sortField] = sortOrder;
  } else {
    sort['releaseDate'] = 1; // Default to sort by release date ascending
  }

  // Check for cached movies using the single cache key
  const cachedMovies = await redisClient.get(MOVIES_LIST_CACHE_KEY);
  if (cachedMovies) {
    console.log('Cache hit for movies list'); 
    return res.status(200).json(JSON.parse(cachedMovies));
  } else {
    console.log('Cache miss for movies list');
  }

  try {
    // Cache miss - query the database
    const movies = await Movie.find(filter).sort(sort);

    // Store the result in Redis with a TTL (e.g., 60 seconds)
    await redisClient.set(MOVIES_LIST_CACHE_KEY, JSON.stringify(movies), { EX: 60 });

    // Return the movies
    res.status(200).json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a movie by ID
router.get('/:id', async (req, res) => {
  const movieId = req.params.id;

  try {
    // Check if movie is cached in Redis
    const cachedMovie = await redisClient.get(movieId);

    if (cachedMovie) {
      // Cache hit - return the cached movie
      console.log('Cache hit for:', movieId); // Log for cache hit
      return res.status(200).json(JSON.parse(cachedMovie));
    } else {
      // Cache miss - query the database
      console.log('Cache miss for:', movieId); // Log for cache miss
      const movie = await Movie.findById(movieId);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });

      // Cache the movie with a TTL of 60 seconds
      await redisClient.set(movieId, JSON.stringify(movie), { EX: 60 });

      res.status(200).json(movie);
    }
  } catch (err) {
    console.error('Error fetching movie:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update a movie
router.put('/:id', async (req, res) => {
  const { title, genre, rating, releaseDate, runtime } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, genre, rating, releaseDate, runtime },
      { new: true }
    );

    if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });

    // Clear the cache for this movie
    await redisClient.del(req.params.id);

    // Also, clear the cache for the movies list after update
    await redisClient.del(MOVIES_LIST_CACHE_KEY);

    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a movie
router.delete('/:id', async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) return res.status(404).json({ message: 'Movie not found' });

    // Clear the cache for the movies list
    await redisClient.del(MOVIES_LIST_CACHE_KEY); // Use the constant here

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Ensure to close the client when the application is shutting down
process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit();
});

module.exports = router;
