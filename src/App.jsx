import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SolarEnergy from './pages/SolarEnergy'
import Map from './pages/Map'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SolarEnergy />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
