import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../infrastructure/services/ApiConfig';
import './AdminUsersPanel.css';

// Define the User interface based on our auth context
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  created: string;
  lastLogin?: string;
}

const AdminUsersPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  
  // Fetch users from the API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('igs_auth_token');
      if (!token) {
        setError('Geen authenticatie token gevonden. Log opnieuw in.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/Auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setError('Ongeldig dataformaat ontvangen van server.');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        setError('Uw sessie is verlopen. Log opnieuw in.');
      } else if (err.response?.status === 403) {
        setError('U heeft geen toegang tot deze functie.');
      } else {
        setError('Er is een fout opgetreden bij het ophalen van gebruikers. Probeer het later opnieuw.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle user view, edit or delete
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('view');
    setIsModalOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };
  
  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Weet je zeker dat je deze gebruiker wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
      try {
        // Replace with actual delete API call when backend is ready
        // await axios.delete(`${API_BASE_URL}/users/${userId}`);
        
        // For now, just remove from the local state
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Er is een fout opgetreden bij het verwijderen van de gebruiker. Probeer het later opnieuw.');
      }
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nooit';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Translate role to Dutch
  const translateRole = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Beheerder',
      'user': 'Gebruiker',
      'pharmacist': 'Apotheker',
      'superadmin': 'Super Beheerder'
    };
    
    return roleMap[role.toLowerCase()] || role;
  };
  
  return (
    <div className="admin-users-panel">
      <div className="admin-users-header">
        <h2 className="admin-users-title">Gebruikers beheren</h2>
        <div className="admin-users-actions">
          <div className="admin-users-search">
            <input
              type="text"
              placeholder="Zoeken op naam, email of rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-users-search-input"
            />
            <i className="fas fa-search admin-users-search-icon"></i>
          </div>
          <button 
            className="admin-users-button primary"
            onClick={handleCreateUser}
          >
            <i className="fas fa-user-plus"></i> Nieuwe gebruiker
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="admin-users-loading">
          <i className="fas fa-spinner fa-spin"></i> Gebruikers laden...
        </div>
      ) : error ? (
        <div className="admin-users-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-users-empty">
          {searchTerm ? (
            <>
              <i className="fas fa-search"></i> Geen gebruikers gevonden voor "{searchTerm}".
            </>
          ) : (
            <>
              <i className="fas fa-users"></i> Geen gebruikers gevonden.
            </>
          )}
        </div>
      ) : (
        <div className="admin-users-table-container">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Naam</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Aangemaakt op</th>
                <th>Laatste login</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`user-role-badge ${user.role.toLowerCase()}`}>
                      {translateRole(user.role)}
                    </span>
                  </td>
                  <td>{formatDate(user.created)}</td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td className="admin-users-actions-cell">
                    <button 
                      className="admin-users-action-button view" 
                      title="Bekijken"
                      onClick={() => handleViewUser(user)}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="admin-users-action-button edit" 
                      title="Bewerken"
                      onClick={() => handleEditUser(user)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="admin-users-action-button delete" 
                      title="Verwijderen"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* User Detail/Edit Modal - This would be implemented as a separate component in a production app */}
      {isModalOpen && (
        <div className="admin-users-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-users-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-users-modal-header">
              <h3>
                {modalMode === 'view' ? 'Gebruiker details' : 
                 modalMode === 'edit' ? 'Gebruiker bewerken' : 
                 'Nieuwe gebruiker aanmaken'}
              </h3>
              <button className="admin-users-modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="admin-users-modal-body">
              {modalMode === 'view' && selectedUser && (
                <div className="admin-users-modal-view">
                  <div className="admin-users-modal-field">
                    <label>Naam:</label>
                    <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div className="admin-users-modal-field">
                    <label>Email:</label>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div className="admin-users-modal-field">
                    <label>Rol:</label>
                    <p>{translateRole(selectedUser.role)}</p>
                  </div>
                  <div className="admin-users-modal-field">
                    <label>Aangemaakt op:</label>
                    <p>{formatDate(selectedUser.created)}</p>
                  </div>
                  <div className="admin-users-modal-field">
                    <label>Laatste login:</label>
                    <p>{formatDate(selectedUser.lastLogin)}</p>
                  </div>
                </div>
              )}
              
              {(modalMode === 'edit' || modalMode === 'create') && (
                <form className="admin-users-modal-form">
                  <div className="admin-users-modal-form-group">
                    <label htmlFor="firstName">Voornaam</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      defaultValue={selectedUser?.firstName || ''}
                      required
                    />
                  </div>
                  <div className="admin-users-modal-form-group">
                    <label htmlFor="lastName">Achternaam</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      defaultValue={selectedUser?.lastName || ''}
                      required
                    />
                  </div>
                  <div className="admin-users-modal-form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      defaultValue={selectedUser?.email || ''}
                      required
                    />
                  </div>
                  <div className="admin-users-modal-form-group">
                    <label htmlFor="role">Rol</label>
                    <select 
                      id="role" 
                      defaultValue={selectedUser?.role || 'user'}
                      required
                    >
                      <option value="user">Gebruiker</option>
                      <option value="admin">Beheerder</option>
                      <option value="pharmacist">Apotheker</option>
                      <option value="superadmin">Super Beheerder</option>
                    </select>
                  </div>
                  {modalMode === 'create' && (
                    <>
                      <div className="admin-users-modal-form-group">
                        <label htmlFor="password">Wachtwoord</label>
                        <input 
                          type="password" 
                          id="password" 
                          required
                        />
                      </div>
                      <div className="admin-users-modal-form-group">
                        <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
                        <input 
                          type="password" 
                          id="confirmPassword" 
                          required
                        />
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
            <div className="admin-users-modal-footer">
              {modalMode === 'view' ? (
                <button 
                  className="admin-users-modal-button secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Sluiten
                </button>
              ) : (
                <>
                  <button 
                    className="admin-users-modal-button secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuleren
                  </button>
                  <button 
                    className="admin-users-modal-button primary"
                    onClick={() => {
                      // Save logic would go here
                      alert('Opslaan functie nog niet geïmplementeerd');
                      setIsModalOpen(false);
                    }}
                  >
                    Opslaan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPanel;
