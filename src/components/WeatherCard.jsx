import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weather, isMainCard = false }) => {
    if (!weather) return null;

    const { name, main, weather: weatherDetails, wind, dt } = weather;
    const { temp, humidity } = main || {};
    const { description, icon } = weatherDetails?.[0] || {};
    const { speed } = wind || {};
    const date = dt ? new Date(dt * 1000).toLocaleDateString() : new Date().toLocaleDateString();

    const iconUrl = icon ? `http://openweathermap.org/img/wn/${icon}@2x.png` : '';

    return (
        <div className={`weather-card ${isMainCard ? 'main-card' : ''}`}>
            <h3 className="weather-card-title">{name}</h3>
            <p className="weather-card-date">{date}</p>
            {iconUrl && <img src={iconUrl} alt={description} className="weather-card-icon"/>}
            <p className="weather-card-temp">{temp?.toFixed(1)}°C</p>
            <p className="weather-card-description">{description}</p>
            <div className="weather-card-details">
                <p>Humidity: {humidity}%</p>
                <p>Wind: {speed} m/s</p>
            </div>
        </div>
    );
};

export default WeatherCard;
