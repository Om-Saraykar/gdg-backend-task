import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieItem from './MovieItem';
import FilterBar from './FilterBar';
import { useNavigate } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for authentication
  const navigate = useNavigate();

  // Fetch movies from the backend
  const fetchMovies = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage

    if (!token) {
      return; // Do not proceed if no token
    }

    try {
      const response = await axios.get('http://localhost:5000/api/v1/movies', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setMovies(response.data);
      setFilteredMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      if (error.response && error.response.status === 403) {
        // Handle forbidden access, e.g., log out
        handleLogout();
      }
    }
  };

  // Handle user login
  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      localStorage.setItem('token', response.data.token); // Store token in local storage
      setIsLoggedIn(true); // Update login state
      navigate('/'); // Redirect to home after login
      fetchMovies(); // Fetch movies after successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setIsLoggedIn(false); // Update login state
    navigate('/login'); // Redirect to login page
  };

  // Handle filter change
  const handleFilterChange = (filters) => {
    let { title, genre, sortBy, order } = filters;
    let filtered = [...movies];

    if (title) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (genre) {
      filtered = filtered.filter(movie => movie.genre === genre);
    }

    // Sort movies based on selected criteria
    filtered.sort((a, b) => {
      const isAsc = order === 'asc';
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';

      if (sortBy === 'releaseDate') {
        return isAsc ? new Date(aValue) - new Date(bValue) : new Date(bValue) - new Date(aValue);
      }

      if (aValue < bValue) return isAsc ? -1 : 1;
      if (aValue > bValue) return isAsc ? 1 : -1;
      return 0;
    });

    setFilteredMovies(filtered);
  };

  // Effect to check if the user is logged in and fetch movies
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check if token exists
    if (token) {
      setIsLoggedIn(true); // Update login state based on token
      fetchMovies(); // Fetch movies only if logged in
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Movies List</h1>
        {isLoggedIn ? ( // Conditional rendering for login/logout button
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
      {!isLoggedIn ? ( // Message for logged-out users
        <p className="text-center text-gray-600 mt-4">
          Please log in to see the movies.
        </p>
      ) : (
        <>
          <div className="mb-6">
            <FilterBar setFilters={handleFilterChange} />
          </div>
          <button
            onClick={() => navigate('/movies/new')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Add New Movie
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredMovies.map((movie) => (
              <MovieItem key={movie._id} movie={movie} />
            ))}
          </div>
          {filteredMovies.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No movies available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MovieList;
