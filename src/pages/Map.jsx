import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import { Search } from 'react-feather';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const solarIcon = L.icon({
    iconUrl: 'https://img.icons8.com/plasticine/100/solar-panel.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const windIcon = L.icon({
    iconUrl: 'https://img.icons8.com/plasticine/100/wind-turbine.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const coalIcon = L.icon({
    iconUrl: 'https://img.icons8.com/plasticine/100/factory.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const getIcon = (type) => {
    switch (type) {
        case 'solar':
            return solarIcon;
        case 'wind':
            return windIcon;
        case 'coal':
            return coalIcon;
        default:
            return solarIcon;
    }
}

const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const Map = () => {
  const [position, setPosition] = useState([20.5937, 78.9629]);
  const [zoom, setZoom] = useState(5);
  const [search, setSearch] = useState('');

  const energyLocations = [
    { lat: 28.6139, lon: 77.2090, name: 'Delhi', type: 'solar', energyOutput: '1500 kWh', co2Emissions: '0 kg', operationalSince: '2023-05-12' },
    { lat: 19.0760, lon: 72.8777, name: 'Mumbai', type: 'wind', energyOutput: '2200 kWh', co2Emissions: '0 kg', operationalSince: '2023-02-28' },
    { lat: 13.0827, lon: 80.2707, name: 'Chennai', type: 'solar', energyOutput: '1800 kWh', co2Emissions: '0 kg', operationalSince: '2023-07-19' },
    { lat: 22.5726, lon: 88.3639, name: 'Kolkata', type: 'coal', energyOutput: '1300 kWh', co2Emissions: '1300 kg', operationalSince: '2023-09-01' },
    { lat: 12.9716, lon: 77.5946, name: 'Bangalore', type: 'solar', energyOutput: '2500 kWh', co2Emissions: '0 kg', operationalSince: '2023-01-15' },
    { lat: 17.3850, lon: 78.4867, name: 'Hyderabad', type: 'wind', energyOutput: '2000 kWh', co2Emissions: '0 kg', operationalSince: '2023-08-22' },
    { lat: 26.9124, lon: 75.7873, name: 'Jaipur', type: 'solar', energyOutput: '1600 kWh', co2Emissions: '0 kg', operationalSince: '2023-06-10' },
    { lat: 23.0225, lon: 72.5714, name: 'Ahmedabad', type: 'wind', energyOutput: '1900 kWh', co2Emissions: '0 kg', operationalSince: '2023-04-05' },
    { lat: 18.5204, lon: 73.8567, name: 'Pune', type: 'coal', energyOutput: '2100 kWh', co2Emissions: '2100 kg', operationalSince: '2023-03-20' },
    { lat: 25.2744, lon: 82.9739, name: 'Varanasi', type: 'solar', energyOutput: '1200 kWh', co2Emissions: '0 kg', operationalSince: '2023-10-01' }
  ];

  const handleSearch = async (e) => {
      e.preventDefault();
      if (search) {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${search}&format=json&limit=1`);
          const data = await response.json();
          if (data && data.length > 0) {
              const { lat, lon } = data[0];
              setPosition([lat, lon]);
              setZoom(10);
          }
      }
  }

  return (
    <div className="map-page">
      <div className="map-controls">
        <form onSubmit={handleSearch} className="search-form">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a location..."
            />
            <button type="submit" className="search-button"><Search size={20} /></button>
        </form>
      </div>
      <MapContainer center={position} zoom={zoom} className="weather-map" zoomControl={false}>
        <ChangeView center={position} zoom={zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {energyLocations.map(location => (
            <Marker key={location.name} position={[location.lat, location.lon]} icon={getIcon(location.type)}>
                <Popup>
                    <h3>{location.name}</h3>
                    <p>Energy Type: {location.type.charAt(0).toUpperCase() + location.type.slice(1)}</p>
                    <p>Energy Output: {location.energyOutput}</p>
                    <p>CO2 Emissions: {location.co2Emissions}</p>
                    <p>Operational Since: {location.operationalSince}</p>
                </Popup>
            </Marker>
        ))}

      </MapContainer>
    </div>
  );
};

export default Map;
