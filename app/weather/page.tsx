'use client';

import SearchBox from '../components/SearchBox';
import Country from '../components/Country';
import WeatherOutput from '../components/WeatherOutput';
import { fetchWeather } from '../util';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



export default function Page() {
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
      fetchUserId(email); 
    } 
    // Uncomment below if you want to enforce login to view weather page
    // else {
    //   router.push('/login');
    // }
  }, [router]);

  const fetchUserId = async (email: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/getUserId?email=${email}`);
      if (!response.ok) throw new Error('Failed to fetch user ID');
      
      const data = await response.json();
      setUserId(data.userId);
      localStorage.setItem('userId', data.userId);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  const handleGetWeather = async () => {
    if (!city) {
      setError('City field empty');
      return;
    }

    try {
      const weatherData = await fetchWeather(city, countryCode);
      setWeather(weatherData);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setWeather(null);
    }
  };

  const handleClear = () => {
    setCity('');
    setWeather(null);
    setError('');
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Logout failed");

      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
      localStorage.removeItem('authToken');
      setUserEmail('');
      //alert("Logged out successfully!");
      router.push('/login');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error occured in logout');
      }
    }
  };

  //console.log("userId--",userId);
  return (
    <div>
      <div className="absolute top-4 right-4 flex items-center space-x-2">
      {userEmail ? (
        <>
          <h2>Welcome, {userEmail}</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-300"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLoginRedirect}
          className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold shadow-md transition-colors duration-300"
        >
          Login
        </button>
      )}
      </div>
      <SearchBox inputVal={city} setInput={setCity} labelName="City" onClear={handleClear} onEnter={handleGetWeather} />
      <Country setCountryCode={setCountryCode} />
      <button
        onClick={handleGetWeather}
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Get Weather Information
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {weather && <WeatherOutput weather={weather} userId={userId} showBookmarkButton={!!userEmail}/>}


      {userEmail && <Link href="/bookmarks" className="text-blue-500 underline mt-4 block">
      View Bookmarked Cities
      </Link>}
      
    </div>
  );
}
