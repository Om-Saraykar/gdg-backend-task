import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MovieForm = ({ movie }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [runtime, setRuntime] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  // Set initial values if movie is passed as prop
  useEffect(() => {
    if (movie) {
      setTitle(movie.title);
      setGenre(movie.genre);
      setRating(movie.rating);
      setReleaseDate(movie.releaseDate);
      setRuntime(movie.runtime);
    }
  }, [movie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const movieData = { title, genre, rating, releaseDate, runtime };
    const token = localStorage.getItem('token'); // Get the token from local storage

    if (!token) {
      alert('Please log in to add or update movies.'); // Alert if not logged in
      navigate('/login'); // Redirect to login page
      return; // Stop further execution
    }

    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      };

      if (id) {
        await axios.put(`http://localhost:5000/api/v1/movies/${id}`, movieData, headers);
      } else {
        await axios.post('http://localhost:5000/api/v1/movies', movieData, headers);
      }
      navigate('/'); // Redirect to home after submission
    } catch (error) {
      console.error(error);
      alert('Error saving movie');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{id ? 'Update Movie' : 'Add Movie'}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <input
        type="number"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <input
        type="date"
        placeholder="Release Date"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <input
        type="number"
        placeholder="Runtime (minutes)"
        value={runtime}
        onChange={(e) => setRuntime(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {id ? 'Update Movie' : 'Add Movie'}
      </button>
    </form>
  );
};

export default MovieForm;
