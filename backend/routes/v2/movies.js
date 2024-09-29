const express = require('express');
const router = express.Router();
const Movie = require('../../models/v2/Movie');

// Create a new movie (including director field)
router.post('/', async (req, res) => {
  const { title, genre, rating, releaseDate, runtime, director } = req.body;

  try {
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ message: 'Movie already exists' });
    }

    const newMovie = new Movie({ title, genre, rating, releaseDate, runtime, director });
    const savedMovie = await newMovie.save();

    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all movies (with filtering and sorting)
router.get('/', async (req, res) => {
  const { title, genre, year, rating, runtime, director, sortBy, order } = req.query;

  let filter = {};
  let sort = {};

  // Add filters based on the query parameters provided
  if (title) filter.title = { $regex: title, $options: 'i' };  // Case-insensitive search for title
  if (genre) filter.genre = genre;
  if (director) filter.director = { $regex: director, $options: 'i' }; // Filter by director
  if (year) filter.releaseDate = { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) };  // Filter by year
  if (rating) filter.rating = { $gte: rating };  // Filter by minimum rating
  if (runtime) filter.runtime = { $gte: runtime };  // Filter by minimum runtime

  // Sorting logic
  if (sortBy) {
    const sortField = sortBy === 'year' ? 'releaseDate' : sortBy;
    const sortOrder = order === 'desc' ? -1 : 1;
    sort[sortField] = sortOrder;
  }

  try {
    const movies = await Movie.find(filter).sort(sort);  // Apply filtering and sorting
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a movie (including director field)
router.put('/:id', async (req, res) => {
  const { title, genre, rating, releaseDate, runtime, director } = req.body;
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, genre, rating, releaseDate, runtime, director },
      { new: true }
    );
    if (!updatedMovie) return res.status(404).json({ message: 'Movie not found' });
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
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
