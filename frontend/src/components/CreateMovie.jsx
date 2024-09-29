import React, { useState } from 'react';

const CreateMovie = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [runtime, setRuntime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMovie = { title, genre, rating: Number(rating), releaseDate, runtime: Number(runtime) };

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        const createdMovie = await response.json();
        onCreate(createdMovie);
        // Reset form fields
        setTitle('');
        setGenre('');
        setRating('');
        setReleaseDate('');
        setRuntime('');
      } else {
        console.error('Error creating movie:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Create Movie</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        required
      />
      <input
        type="text"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        required
      />
      <input
        type="number"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        required
      />
      <input
        type="date"
        placeholder="Release Date"
        value={releaseDate}
        onChange={(e) => setReleaseDate(e.target.value)}
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        required
      />
      <input
        type="number"
        placeholder="Runtime (minutes)"
        value={runtime}
        onChange={(e) => setRuntime(e.target.value)}
        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        required
      />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition duration-300">
        Create Movie
      </button>
    </form>
  );
};

export default CreateMovie;
