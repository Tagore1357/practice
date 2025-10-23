import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './Home.css';
import { Cloud, Wind, Sunrise, Sunset, Thermometer, Droplet, Eye, Zap, ChevronsUp, ChevronsDown, Smile } from 'react-feather';
import { locations } from '../locations.js';

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState({ value: 'Mumbai', label: 'Mumbai' });
  const [currentTime, setCurrentTime] = useState('');

  const allCities = Object.values(locations.India).flat();
  const cityOptions = allCities.map(city => ({ value: city, label: city }));

  useEffect(() => {
    if (city && city.value) {
        const fetchWeatherData = async () => {
            setLoading(true);
            try {
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value},India&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
                const weatherData = await weatherResponse.json();

                if (weatherData.cod !== 200) {
                    setWeatherData(null);
                    setForecastData(null);
                    setAirQualityData(null);
                } else {
                    setWeatherData(weatherData);
                    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city.value},India&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
                    const forecastData = await forecastResponse.json();
                    setForecastData(forecastData);

                    const airQualityResponse = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
                    const airQualityData = await airQualityResponse.json();
                    setAirQualityData(airQualityData);
                    console.log("airQualityData",)
                }

            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
            setLoading(false);
        };

        fetchWeatherData();
    }
  }, [city]);

  useEffect(() => {
    if (weatherData) {
      const interval = setInterval(() => {
        const date = new Date();
        const utc_timestamp = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        const city_timestamp = utc_timestamp + (weatherData.timezone * 1000);
        const cityDate = new Date(city_timestamp);

        setCurrentTime(cityDate.toLocaleTimeString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [weatherData]);

  const getAqiDescription = (aqi) => {
    if (aqi === 1) return 'Good';
    if (aqi === 2) return 'Fair';
    if (aqi === 3) return 'Moderate';
    if (aqi === 4) return 'Poor';
    if (aqi === 5) return 'Very Poor';
    return 'Unknown';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getLocalTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  }

  const getLocalTimeForForecast = (dt_txt, timezone) => {
      const date = new Date(dt_txt + 'Z'); // Append Z to indicate UTC
      const localDate = new Date(date.getTime() + timezone * 1000);
      return localDate.toLocaleTimeString([], {hour: 'numeric', hour12: true, timeZone: 'UTC'});
  }

  const todaysForecast = forecastData ? forecastData.list.slice(0, 8) : [];
  const maxTempForecast = todaysForecast.length > 0 ? Math.max(...todaysForecast.map(item => item.main.temp)) : 0;

  return (
    <div className="home-wrapper">
        <div className="home-page fade-in">
            <div className="search-bar">
                {/* <label htmlFor="city-select" className="city-label">City</label> */}
                <Select
                    id="city-select"
                    value={city}
                    onChange={setCity}
                    options={cityOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                />
            </div>
          {weatherData && forecastData ? (
            <>
                <div className="left-panel">
                     <div className="current-weather-panel-full">
                        <div className="current-weather-main">
                            <p className="current-temp-display">{Math.round(weatherData.main.temp)}°C</p>
                            <img className="weather-icon-large" src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="weather icon" />
                        </div>
                        <p className="current-day">{currentTime}</p>
                        <p className="weather-description">{weatherData.weather[0].description}</p>
                        <div className="weather-details-grid">
                            <div className="detail-item">
                                <ChevronsUp size={24} />
                                <div>
                                    <p>High</p>
                                    <p className="detail-value">{Math.round(weatherData.main.temp_max)}°C</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <ChevronsDown size={24} />
                                <div>
                                    <p>Low</p>
                                    <p className="detail-value">{Math.round(weatherData.main.temp_min)}°C</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Smile size={24} />
                                <div>
                                    <p>Feels Like</p>
                                    <p className="detail-value">{Math.round(weatherData.main.feels_like)}°C</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Thermometer size={24} />
                                <div>
                                    <p>Pressure</p>
                                    <p className="detail-value">{weatherData.main.pressure} hPa</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Droplet size={24} />
                                <div>
                                    <p>Humidity</p>
                                    <p className="detail-value">{weatherData.main.humidity}%</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Eye size={24} />
                                <div>
                                    <p>Visibility</p>
                                    <p className="detail-value">{weatherData.visibility / 1000} km</p>
                                </div>
                            </div>
                            <div className="detail-item">
                                <Wind size={24} />
                                <div>
                                    <p>Wind</p>
                                    <p className="detail-value">{weatherData.wind.speed} km/h</p>
                                </div>
                            </div>
                             <div className="detail-item sunrise-sunset">
                                <div>
                                    <p><Sunrise size={24}/> Sunrise</p>
                                    <p className="detail-value">{getLocalTime(weatherData.sys.sunrise, weatherData.timezone)}</p>
                                </div>
                                <div>
                                    <p><Sunset size={24}/> Sunset</p>
                                    <p className="detail-value">{getLocalTime(weatherData.sys.sunset, weatherData.timezone)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="today-forecast-card">
                        <h2>Today</h2>
                        <div className="today-forecast-chart">
                            {todaysForecast.map((item, index) => {
                                const temp = Math.round(item.main.temp);
                                const barHeight = maxTempForecast > 0 ? (temp / (maxTempForecast + 5)) * 100 : 0;

                                return (
                                    <div key={index} className="chart-item">
                                        <div className="chart-bar-wrapper">
                                            <div className="chart-bar" style={{ height: `${barHeight}%` }}>
                                                <span className="chart-bar-temp">{temp}°C</span>
                                            </div>
                                        </div>
                                        <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="weather icon" className="chart-icon" />
                                        <p className="chart-label">{getLocalTimeForForecast(item.dt_txt, weatherData.timezone)}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="highlights-card">
                        <h2>Highlights</h2>
                        <div className="highlights-grid">
                            <div className="highlight-item">
                                <h4>UV Index</h4>
                                <p className="highlight-value">6</p>
                            </div>
                            <div className="highlight-item">
                                <h4>Wind Status</h4>
                                <p className="highlight-value">{weatherData.wind.speed} <span>km/h</span></p>
                            </div>
                            <div className="highlight-item">
                                <h4>Sunrise & Sunset</h4>
                                <p><Sunrise size={20}/> {getLocalTime(weatherData.sys.sunrise, weatherData.timezone)}</p>
                                <p><Sunset size={20}/> {getLocalTime(weatherData.sys.sunset, weatherData.timezone)}</p>
                            </div>
                            <div className="highlight-item">
                                <h4>Humidity</h4>
                                <p className="highlight-value">{weatherData.main.humidity} <span>%</span></p>
                                <p>Normal</p>
                            </div>
                            <div className="highlight-item">
                                <h4>Visibility</h4>
                                <p className="highlight-value">{weatherData.visibility / 1000} <span>km</span></p>
                                <p>Average</p>
                            </div>
                            {airQualityData && (
                                <div className="highlight-item">
                                    <h4>Air Quality</h4>
                                    <p className="highlight-value">{airQualityData.list[0].main.aqi}</p>
                                    <p>{getAqiDescription(airQualityData.list[0].main.aqi)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
            ) : (
            <div className="error-message">
              <h1>City not found</h1>
              <p>Please enter a valid city name.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default Home;
