import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../infrastructure/auth/AuthContext';
import AdminChangelogPanel from './AdminChangelogPanel';
import AdminUsersPanel from './AdminUsersPanel';
import AdminProductsPanel from './AdminProductsPanel';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('changelog');

  // Redirect if not admin
  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null; // Don't render anything while redirecting
  }
  
  // Function to handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Admin Beheer</h1>
      
      <div className="admin-dashboard-nav">
        <button 
          className={`admin-nav-item ${activeTab === 'changelog' ? 'active' : ''}`}
          onClick={() => handleTabChange('changelog')}
        >
          Changelog
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          Gebruikers
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => handleTabChange('products')}
        >
          Producten
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          Bestellingen
        </button>
        <button 
          className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => handleTabChange('settings')}
        >
          Instellingen
        </button>
      </div>
      
      <div className="admin-dashboard-content">
        {activeTab === 'changelog' && <AdminChangelogPanel />}
        
        {activeTab === 'users' && <AdminUsersPanel />}
        
        {activeTab === 'products' && <AdminProductsPanel />}
        
        {activeTab === 'orders' && (
          <div className="admin-placeholder-panel">
            <h2>Bestellingen Beheer</h2>
            <p>Deze functionaliteit is nog in ontwikkeling.</p>
            <div className="admin-placeholder-icon">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="admin-placeholder-panel">
            <h2>Instellingen</h2>
            <p>Deze functionaliteit is nog in ontwikkeling.</p>
            <div className="admin-placeholder-icon">
              <i className="fas fa-cog"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
