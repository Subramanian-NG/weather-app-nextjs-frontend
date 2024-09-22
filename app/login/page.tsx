'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 2000); 
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `${backendUrl}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('User registered successfully');
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    setSuccess('');

    try {  
      const response = await fetch(
        `${backendUrl}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      
      
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('userEmail', email);
      localStorage.setItem('authToken', data.token);

      //console.log("localstorage--",localStorage);
      router.push('/weather');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    
      <div>
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          
        <a href="/" className="text-blue-500 hover:underline">Home</a>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 text-gray-900"
          >
            Sign In
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
          >
            Register
          </button>
        </div>
      </div>
  );
}
