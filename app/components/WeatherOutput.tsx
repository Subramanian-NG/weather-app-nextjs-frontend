import React, { useState, useEffect } from 'react';

interface WeatherOutputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  weather: any;
  userId: string;
  showBookmarkButton?: boolean;  // New optional prop to toggle the bookmark button
}

export default function WeatherOutput({ weather, userId, showBookmarkButton = true }: WeatherOutputProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!weather) {
    return <div className="text-center text-red-500">Weather Information not available.</div>;
  }

  const weatherObj = weather;
  const city = `${weatherObj.name},${weatherObj.sys.country}`;

  const fetchBookmarkedCities = async () => {
    // if (!showBookmarkButton) {
    //   setLoading(false); 
    //   return;
    // }
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await fetch(`${backendUrl}/api/actions/bookmarks/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const bookmarkedCities = await response.json();
      setIsBookmarked(bookmarkedCities.includes(city));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  fetchBookmarkedCities();
}, [city, userId, showBookmarkButton]);

  const handleBookmark = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      await fetch(`${backendUrl}/api/actions/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ userId, city }),
      });
      setIsBookmarked(true);
    } catch (error) {
      console.error('Error bookmarking the city:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold text-gray-800">Weather in {weatherObj.name}</h2>
      <p className="text-gray-700">
        <span className="font-semibold">Temperature:</span> {weatherObj.main.temp} °C
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Weather:</span> {weatherObj.weather[0].description}
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Feels like:</span> {weatherObj.main.feels_like} °C
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Min Temp:</span> {weatherObj.main.temp_min} °C
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Max Temp:</span> {weatherObj.main.temp_max} °C
      </p>
      <p className="text-gray-700">
        <span className="font-semibold">Country:</span> {weatherObj.sys.country}
      </p>

      {!loading && showBookmarkButton && (
        <button
          className={`mt-4 px-4 py-2 rounded-lg text-white ${
            isBookmarked ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleBookmark}
          disabled={isBookmarked}
        >
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      )}

      {loading && showBookmarkButton && <p className="text-center text-gray-500 mt-4">Loading...</p>}
    </div>
  );
}
