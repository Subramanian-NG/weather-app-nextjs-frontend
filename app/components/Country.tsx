'use client'
import { useState, useEffect } from "react";
import { fetchCountries } from "../util";

interface CountryProps {
  setCountryCode: (countryCode: string) => void;
}

export default function Country({ setCountryCode }: CountryProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const fetchedCountries = await fetchCountries();
        setCountries(fetchedCountries);
      } catch (error) {
        console.error("Error fetching countries", error);
      }
    };
    loadCountries();
  }, []);

  return (
    <div className="mb-4">
      {/* <label className="block text-gray-700 text-sm font-bold mb-2">Country: </label> */}
      <select
        defaultValue=""
        onChange={(e) => setCountryCode(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 text-gray-900"
      >
        <option value="">
          Select Country
        </option>
        {countries.map((country) => (
          <option key={country.alpha2Code} value={country.alpha2Code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
}
