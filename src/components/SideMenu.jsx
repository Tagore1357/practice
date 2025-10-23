import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sun, Map as MapIcon } from 'react-feather';
import './SideMenu.css';

const SideMenu = () => {
  return (
    <div className="side-menu">
      <div className='side-menu-header'>
        <h1>EcoTrack</h1>
      </div>
      <nav className="side-menu-nav">
        <ul>
          {/* <li>
            <NavLink to="/" end>
              <Home />
              <span className="nav-text">Dashboard</span>
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/">
              <Sun />
              <span className="nav-text">Enerlytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/map">
              <MapIcon />
              <span className="nav-text">EnergyMap</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideMenu;
