import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateMovie = () => {
  const { id } = useParams(); // Use useParams to get the movie ID
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      const token = localStorage.getItem('token'); // Get the token from local storage
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Prepare headers

      try {
        const response = await axios.get(`http://localhost:5000/api/v1/movies/${id}`, { headers }); // Include headers
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
        alert('Error fetching movie. Please check if you are logged in.'); // Alert on error
      }
    };

    fetchMovie();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (!token) {
      alert('Please log in to update movies.'); // Alert if not logged in
      navigate('/login'); // Redirect to login page
      return; // Stop further execution
    }

    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      };

      const response = await axios.put(`http://localhost:5000/api/v1/movies/${id}`, movie, headers);

      if (response.status === 200) {
        alert('Movie updated successfully!'); 
        navigate('/'); 
      } else {
        console.error('Error updating movie:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the movie. Please try again.');
    }
  };

  if (!movie) return <p>Error loading movie details. Please try again.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Update Movie</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Title"
          value={movie.title}
          onChange={(e) => setMovie({ ...movie, title: e.target.value })}
          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={movie.genre}
          onChange={(e) => setMovie({ ...movie, genre: e.target.value })}
          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
        <input
          type="number"
          placeholder="Rating"
          value={movie.rating}
          onChange={(e) => setMovie({ ...movie, rating: Number(e.target.value) })}
          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
        <input
          type="date"
          value={movie.releaseDate.split('T')[0]} // Format to YYYY-MM-DD
          onChange={(e) => setMovie({ ...movie, releaseDate: e.target.value })}
          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
        <input
          type="number"
          placeholder="Runtime (minutes)"
          value={movie.runtime}
          onChange={(e) => setMovie({ ...movie, runtime: Number(e.target.value) })}
          className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
          required
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition duration-300">
          Update Movie
        </button>
      </form>
    </div>
  );
};

export default UpdateMovie;
