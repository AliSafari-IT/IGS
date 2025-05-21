import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, User } from '../../../infrastructure/auth/AuthContext';
import './Auth.css';
import './UserAccount.css';

const UserAccount: React.FC = () => {
  const { user, logout, updateProfile, changePassword, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#profile') setActiveTab('profile');
    else if (location.hash === '#orders') setActiveTab('orders');
    else if (location.hash === '#recipes') setActiveTab('recipes');
  }, [location.hash]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  // Use useEffect for form data initialization only
  useEffect(() => {
    // Initialize form data when user data is available
    if (user) {
      console.log('Initializing form data with user:', user.email);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  // If not authenticated and not loading, show a message instead of redirecting
  // The ProtectedRoute in AppRoutes will handle the redirect
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError(null);
    
    try {
      const success = await updateProfile(formData);
      if (success) {
        setUpdateSuccess(true);
        setIsEditing(false);
        // Clear success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        setUpdateError('Failed to update profile. Please try again.');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      // Display error message from API if available
      if (err.response && err.response.data && err.response.data.message) {
        setUpdateError(err.response.data.message);
      } else {
        setUpdateError('An error occurred while updating your profile.');
      }
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess(false);
    setPasswordChangeError(null);
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordChangeError('New passwords do not match');
      return;
    }
    
    try {
      const success = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmNewPassword
      );
      
      if (success) {
        setPasswordChangeSuccess(true);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        // Clear success message after 3 seconds
        setTimeout(() => setPasswordChangeSuccess(false), 3000);
      } else {
        setPasswordChangeError('Failed to change password. Please try again.');
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      // Display error message from API if available
      if (err.response && err.response.data && err.response.data.message) {
        setPasswordChangeError(err.response.data.message);
      } else {
        setPasswordChangeError('An error occurred while changing your password.');
      }
    }
  };
  
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    // First logout to reset the user state
    logout();
    
    // Then navigate using window.location to avoid DataCloneError
    setTimeout(() => {
      window.location.href = '/';
    }, 50);
  };

  return (
    <div className="user-account-container">
      <div className="user-account-sidebar">
        <div className="user-info">
          <div className="user-avatar">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div className="user-name">
            {user.firstName} {user.lastName}
          </div>
          <div className="user-email">{user.email}</div>
        </div>
        
        <nav className="account-nav">
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i> Mijn profiel
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-shopping-bag"></i> Mijn bestellingen
          </button>
          <button 
            className={`nav-item ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            <i className="fas fa-prescription-bottle-alt"></i> Mijn recepten
          </button>
          <button 
            className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <i className="fas fa-map-marker-alt"></i> Mijn adressen
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i> Instellingen
          </button>
          <button 
            className="nav-item logout"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Uitloggen
          </button>
        </nav>
      </div>
      
      <div className="user-account-content">
        {activeTab === 'profile' && (
          <div className="account-section">
            <div className="section-header">
              <h2>Mijn profiel</h2>
              {!isEditing && (
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit"></i> Bewerken
                </button>
              )}
            </div>
            
            {updateSuccess && (
              <div className="success-message">
                Uw profiel is succesvol bijgewerkt!
              </div>
            )}
            
            {updateError && (
              <div className="error-message">
                {updateError}
              </div>
            )}
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Voornaam</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Achternaam</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">E-mailadres</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                      });
                    }}
                  >
                    Annuleren
                  </button>
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Opslaan...' : 'Wijzigingen opslaan'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <div className="info-label">Naam</div>
                  <div className="info-value">{user.firstName} {user.lastName}</div>
                </div>
                
                <div className="info-group">
                  <div className="info-label">E-mailadres</div>
                  <div className="info-value">{user.email}</div>
                </div>
                
                <div className="info-group">
                  <div className="info-label">Account type</div>
                  <div className="info-value">{user.role === 'customer' ? 'Klant' : user.role === 'pharmacist' ? 'Apotheker' : 'Beheerder'}</div>
                </div>
                
                <div className="info-group">
                  <div className="info-label">Recepten toegang</div>
                  <div className="info-value">{user.prescriptionAccess ? 'Ja' : 'Nee'}</div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="account-section">
            <h2>Mijn bestellingen</h2>
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <h3>Geen bestellingen gevonden</h3>
              <p>U heeft nog geen bestellingen geplaatst.</p>
              <button className="primary-button" onClick={() => navigate('/medications')}>
                Bekijk onze producten
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'prescriptions' && (
          <div className="account-section">
            <h2>Mijn recepten</h2>
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-prescription-bottle-alt"></i>
              </div>
              <h3>Geen recepten gevonden</h3>
              <p>U heeft nog geen recepten toegevoegd aan uw account.</p>
              <button className="primary-button" onClick={() => navigate('/prescriptions')}>
                Bekijk receptmedicijnen
              </button>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="account-section">
            <h2>Mijn recepten</h2>
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-prescription-bottle-alt"></i>
              </div>
              <h3>Geen recepten gevonden</h3>
              <p>U heeft nog geen recepten toegevoegd aan uw account.</p>
              <button className="primary-button" onClick={() => navigate('/prescriptions')}>
                Bekijk receptmedicijnen
              </button>
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="account-section">
            <h2>Mijn adressen</h2>
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Geen adressen gevonden</h3>
              <p>U heeft nog geen adressen toegevoegd aan uw account.</p>
              <button className="primary-button">
                Adres toevoegen
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="account-section">
            <h2>Instellingen</h2>
            
            <div className="settings-section">
              <h3>Wachtwoord wijzigen</h3>
              
              {passwordChangeSuccess && (
                <div className="success-message">
                  Uw wachtwoord is succesvol gewijzigd!
                </div>
              )}
              
              {passwordChangeError && (
                <div className="error-message">
                  {passwordChangeError}
                </div>
              )}
              
              <form onSubmit={handlePasswordChange} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Huidig wachtwoord</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">Nieuw wachtwoord</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    required
                    minLength={8}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmNewPassword">Bevestig nieuw wachtwoord</label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordInputChange}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Wachtwoord wijzigen
                  </button>
                </div>
              </form>
            </div>
            
            <div className="settings-section">
              <h3>Notificaties</h3>
              <div className="setting-option">
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <div className="setting-label">E-mail notificaties voor bestellingen</div>
              </div>
              
              <div className="setting-option">
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
                <div className="setting-label">E-mail notificaties voor promoties en aanbiedingen</div>
              </div>
            </div>
            
            <div className="settings-section danger-zone">
              <h3>Account verwijderen</h3>
              <p>Wanneer u uw account verwijdert, worden al uw gegevens permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.</p>
              <button className="danger-button">
                Account verwijderen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
