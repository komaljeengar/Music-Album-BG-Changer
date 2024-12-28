import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar'; // Ensure the path is correct
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState('');
  const [results, setResults] = useState([]);

  // Fetch Spotify Token
  useEffect(() => {
    const fetchSpotifyToken = async () => {
      const clientId = '0ebd10deee2343e88ea565cc4b788975';
      const clientSecret = '9237b86ae7c2472d95a9b9d84b839d44';

      const base64Credentials = btoa(`${clientId}:${clientSecret}`);

      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          new URLSearchParams({ grant_type: 'client_credentials' }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${base64Credentials}`,
            },
          }
        );
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error fetching Spotify token:', error.response?.data || error.message);
      }
    };

    fetchSpotifyToken();
  }, []);

  // Handle Search Query
  const handleSearch = async (query) => {
    try {
      const response = await fetchSpotifyResults(query);
      setResults(response.tracks.items);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  // Fetch Spotify Search Results
  const fetchSpotifyResults = async (query) => {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Spotify API Error: ${res.status}`);
    }

    return await res.json();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-black">Search for Songs</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
        {results.map((song) => (
          <div key={song.id} className="bg-white p-4 rounded-lg shadow-md text-center">
            <img
              src={song.album.images?.[0]?.url || 'https://via.placeholder.com/150'}
              alt={song.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{song.name}</h3>
            <p className="text-sm text-gray-600">{song.artists?.[0]?.name || 'Unknown Artist'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
