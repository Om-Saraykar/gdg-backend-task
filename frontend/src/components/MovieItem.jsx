import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieItem = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movie._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300 cursor-pointer transform"
    >
      <h3 className="text-xl font-bold mb-2 text-gray-800">{movie.title}</h3>
      <p className="text-sm text-gray-600">Genre: <span className="font-semibold">{movie.genre}</span></p>
      <p className="text-sm text-gray-600">Rating: <span className="font-semibold">{movie.rating}</span></p>
      <p className="text-sm text-gray-600">Release Date: <span className="font-semibold">{new Date(movie.releaseDate).toDateString()}</span></p>
      <p className="text-sm text-gray-600">Runtime: <span className="font-semibold">{movie.runtime} minutes</span></p>
    </div>
  );
};

export default MovieItem;
