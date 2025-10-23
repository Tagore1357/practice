import React from 'react';
import SideMenu from './SideMenu';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <div className='sidemenu'>
        <SideMenu />
      </div>
      <div className='outLet'>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
