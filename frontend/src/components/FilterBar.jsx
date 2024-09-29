import React, { useState } from 'react';

const FilterBar = ({ setFilters }) => {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState('asc');

  const genres = ['All', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance'];

  const handleSearch = () => {
    setFilters({ title, genre, sortBy, order });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
      {/* Search by Title */}
      <input
        type="text"
        placeholder="Search by title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      />

      {/* Filter by Genre Dropdown */}
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      >
        {genres.map((g) => (
          <option key={g} value={g === 'All' ? '' : g}>
            {g}
          </option>
        ))}
      </select>

      {/* Sort by Property Dropdown */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <option value="title">Title</option>
        <option value="rating">Rating</option>
        <option value="releaseDate">Release Date</option>
        <option value="runtime">Runtime</option>
      </select>

      {/* Order Ascending or Descending */}
      <select
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition duration-300"
      >
        Search
      </button>
    </div>
  );
};

export default FilterBar;
