import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Using environment variable
const API_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (city) => {
  const params = {
    q: city,
    appid: API_KEY,
    units: 'metric', // Get temperature in Celsius
  };
  const fullUrl = `${API_URL}/weather?${new URLSearchParams(params).toString()}`;
  console.log(`Fetching weather data from: ${fullUrl}`);
  
  if (!API_KEY) {
    throw new Error("VITE_WEATHER_API_KEY is not defined. Please add it to your .env file.");
  }

  try {
    const response = await axios.get(fullUrl);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Invalid API Key. Please check your VITE_WEATHER_API_KEY in the .env file.");
    }
    throw error;
  }
};

export const getForecast = async (city) => {
  const params = {
    q: city,
    appid: API_KEY,
    units: 'metric', // Get temperature in Celsius
  };
  const fullUrl = `${API_URL}/forecast?${new URLSearchParams(params).toString()}`;
  console.log(`Fetching forecast data from: ${fullUrl}`);

  if (!API_KEY) {
    throw new Error("VITE_WEATHER_API_KEY is not defined. Please add it to your .env file.");
  }

  try {
    const response = await axios.get(fullUrl);
    // The API returns a list of forecasts. We'll take the forecast for the next 5 days at the same time of day.
    const dailyData = response.data.list.filter(reading => reading.dt_txt.includes("18:00:00"));
    return dailyData;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Invalid API Key. Please check your VITE_WEATHER_API_KEY in the .env file.");
    }
    throw error;
  }
};
