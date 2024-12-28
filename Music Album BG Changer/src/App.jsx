import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';
import ColorThief from 'colorthief';

const App = () => {
  const [token, setToken] = useState('');
  const [results, setResults] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');

  // Fetch Spotify Token
  useEffect(() => {
    const fetchSpotifyToken = async () => {
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

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

  // Search Query
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

  // Click on Song Image to Change Background Color
  const handleCardClick = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Prevent CORS issues
    img.src = imageUrl;

    img.onload = () => {
      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(img);
      setBgColor(`rgb(${r}, ${g}, ${b})`);
    };

    img.onerror = () => {
      console.error('Error loading image for color extraction');
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: bgColor }}>
      <h1 className="text-4xl font-bold text-center mb-8 text-black">Search for Songs</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
        {results.map((song) => (
          <div
            key={song.id}
            className="bg-white p-4 rounded-lg shadow-md text-center cursor-pointer"
            onClick={() => handleCardClick(song.album.images?.[0]?.url || 'https://via.placeholder.com/150')}
          >
            <img
              src={song.album.images?.[0]?.url || 'https://via.placeholder.com/150'}
              alt={song.name}
              className="w-full h-48 object-cover rounded-md mb-4"
              crossOrigin="anonymous"
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
