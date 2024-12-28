import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        placeholder="Search for a song..."
        className="w-72 p-3 text-lg border border-gray-300 rounded-md mr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleSearchClick}
        className="px-4 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
