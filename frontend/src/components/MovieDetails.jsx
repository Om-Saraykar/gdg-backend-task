import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  // Fetch movie details from the backend
  const fetchMovie = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage

    if (!token) {
      alert('Please log in to view movie details.'); // Alert if not logged in
      navigate('/login'); // Redirect to login page
      return; // Stop further execution
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/v1/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      if (error.response && error.response.status === 403) {
        alert('You do not have permission to view this movie.'); // Alert for forbidden access
        navigate('/'); // Navigate back to home
      }
    }
  };

  // Handle movie deletion
  const handleDelete = async () => {
    // Confirm deletion
    const confirmDelete = window.confirm('Are you sure you want to delete this movie?');
    if (confirmDelete) {
      const token = localStorage.getItem('token'); // Get the token for deletion

      if (!token) {
        alert('Please log in to delete a movie.'); // Alert if not logged in
        navigate('/login'); // Redirect to login page
        return; // Stop further execution
      }

      try {
        await axios.delete(`http://localhost:5000/api/v1/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });
        alert('Movie deleted successfully!'); 
        navigate('/'); // Navigate back to the movie list
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  // Handle navigation to edit movie
  const handleEdit = () => {
    navigate(`/movies/edit/${id}`); // Navigate to edit page
  };

  // Effect to fetch movie details when the component mounts
  useEffect(() => {
    fetchMovie();
  }, [id]); // Adding id as a dependency to re-fetch if it changes

  if (!movie) return <p>Loading...</p>; // Show loading state

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">{movie.title}</h2>
      <p className="text-sm text-gray-700">Genre: {movie.genre}</p>
      <p className="text-sm text-gray-700">Rating: {movie.rating}</p>
      <p className="text-sm text-gray-700">Release Date: {new Date(movie.releaseDate).toDateString()}</p>
      <p className="text-sm text-gray-700">Runtime: {movie.runtime} minutes</p>
      <div className="flex gap-2 mt-4">
        <button onClick={handleEdit} className="bg-yellow-500 text-white p-2 rounded">
          Edit Movie
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded">
          Delete Movie
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
