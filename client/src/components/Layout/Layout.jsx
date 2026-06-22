import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex h-screen" style={{ background: '#F7F7F7' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: 28, fontFamily: "'Inter', -apple-system, sans-serif" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;