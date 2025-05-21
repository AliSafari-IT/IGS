import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Don't render the sidebar on category pages since CategoryPage has its own sidebar
  const isCategoryPage = location.pathname.includes('/category/');
  
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        {!isCategoryPage && <Sidebar />}
        <main className={isCategoryPage ? "main-content full-width" : "main-content"}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
