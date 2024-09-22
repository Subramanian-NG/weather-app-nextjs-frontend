'use client';

import { useEffect, useState } from 'react';
import { fetchWeather } from '../util';
import WeatherOutput from '../components/WeatherOutput';
import Link from 'next/link';

export default function Page() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [weatherData, setWeatherData] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  //console.log("userId--",userId);
  //console.log("authToken--",authToken);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const userId  = localStorage.getItem('userId');
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await fetch(`${backendUrl}/api/actions/bookmarks/${userId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks');
        }
        const bookmarkedCities = await response.json();
        setBookmarks(bookmarkedCities);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred.');
          }
      }
    };

    fetchBookmarks();
  }, []);

  useEffect(() => {
    const fetchWeatherForBookmarks = async () => {
      const weatherPromises = bookmarks.map(async (city) => {
        const [cityName, countryCode] = city.split(',');
        const result = await fetchWeather(cityName, countryCode);
        if (result.error) {
          setError(result.error);  
          return { city,data: null};
        } else {
          const data = result.data;
          return { city,data};  
          setError('');
        }
      });

      const results = await Promise.all(weatherPromises);

      //console.log("bookmark results--", results);
      const weatherMap = results.reduce((acc, { city, data }) => {
        acc[`${city}`] = data;
        return acc;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, {} as { [key: string]: any });
      
      setWeatherData(weatherMap);
    };

    if (bookmarks.length > 0) {
      fetchWeatherForBookmarks();
    }
  }, [bookmarks]);

 
  const handleRemoveBookmark = async (city: string) => {
    const userId  = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');
      try {
        const response = await fetch(`${backendUrl}/api/actions/bookmark`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            city: `${city}`, 
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to remove bookmark');
        }
    
        const updatedBookmarks = bookmarks.filter(b => b !== city);
        setBookmarks(updatedBookmarks);
      } catch (err) {
          if (err instanceof Error) {
              setError(err.message);
            } else {
              setError('An unknown error occurred.');
            }
      }
    };

  const handleCityClick = (city: string) => {
    setSelectedCity(prev => (prev === `${city}` ? null : `${city}`));
  };

  return (
    <div>
  <div className="absolute top-4 left-4 flex items-center space-x-2">
    <Link href="/weather" className="text-blue-500 underline mt-4 block">
      Check Weather
    </Link>
  </div>
  {error && <p className="text-red-500">{error}</p>}
  {bookmarks.length === 0 ? (
    <p>No bookmarked cities.</p>
  ) : (
    
    <><p className="text-lg font-bold text-blue-700 mb-4">Click a city to view more details about its weather.</p><ul>
            {bookmarks.map((city) => (
              <li key={city}  className="flex flex-col space-y-2 mb-4 p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition-colors duration-200"
>
                <div className="flex justify-between items-center cursor-pointer" onClick={() => handleCityClick(city)}>
                  <span className="text-gray-900">
                    {city}
                  </span>
                  <span className="ml-4 text-gray-900">
                    {weatherData[`${city}`]?.main?.temp} °C
                  </span>
                  <button
                    onClick={() => handleRemoveBookmark(city)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-auto"
                  >
                    Remove
                  </button>
                </div>
                {selectedCity === `${city}` && weatherData[`${city}`] && (
                  <div className="mt-4 ">
                    <WeatherOutput weather={weatherData[`${city}`]} userId={String(localStorage.getItem('userId'))} showBookmarkButton={false} />
                  </div>
                )}
              </li>
            ))}
          </ul></>
  )}
</div>

  );
}
