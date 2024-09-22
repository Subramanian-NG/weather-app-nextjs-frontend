'use server'
 
export async function fetchWeather(city: string, countryCode: string) {
  const apiKey = process.env.API_KEY;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}&units=metric`,{next: { revalidate: 0 }});
  if (!res.ok) {
    const respJson = await res.json();
    console.error('Error fetching weather data:', respJson);
    return { error: respJson.message || 'Weather data not found' };
  }
  const data = await res.json();
  return { data };
}

export async function fetchCountries() {
    const res = await fetch('https://restcountries.com/v2/all?fields=name,alpha2Code');
    if (!res.ok) {
      throw new Error('Failed to fetch countries');
    }
    const countries = await res.json();
    return countries;
  };


