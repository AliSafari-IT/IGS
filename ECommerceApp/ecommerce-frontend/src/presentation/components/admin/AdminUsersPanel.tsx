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
  phoneNumber?: string;
}

const AdminUsersPanel= () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  
  // Helper function to get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('igs_auth_token');
    return {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
  };// Fetch users from the API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('igs_auth_token');
      console.log('Auth token found:', token ? `${token.substring(0, 10)}...` : 'None');
      
      // Get authentication headers
      const config = getAuthHeaders();
      
      // Log request details for debugging
      console.log('Fetching users from:', `${API_BASE_URL}/Auth/users`);
      console.log('With auth header:', !!config.headers.Authorization);
      
      // Try to fetch users from the API endpoint - Using capital 'A' in Auth to match backend route
      const response = await axios.get(`${API_BASE_URL}/Auth/users`, config);
        if (response.data && Array.isArray(response.data)) {
        // Format the API response to match our User interface
        const formattedUsers = response.data.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          created: user.createdAt,
          lastLogin: user.lastLoginAt,
          phoneNumber: user.phoneNumber
        }));
        
        setUsers(formattedUsers);
      } else {
        // If the response is not as expected, fall back to mock data
        console.warn('API response format unexpected. Using mock data instead.');
        useMockData();
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Niet geautoriseerd. Log opnieuw in met beheerdersrechten.');
      } else {
        setError('Er is een probleem met het ophalen van gebruikers.');
        console.warn('Falling back to mock data');
        // If API call fails, use mock data instead
        useMockData();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to set mock data
  const useMockData = () => {
    setUsers([
      {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@igspharma.nl',
        role: 'admin',
        created: '2023-01-15T10:30:00',
        lastLogin: '2023-06-10T08:45:00',
        phoneNumber: '+31612345678'
      },
      {
        id: '2',
        firstName: 'Jan',
        lastName: 'Jansen',
        email: 'jan.jansen@example.com',
        role: 'user',
        created: '2023-02-20T14:15:00',
        lastLogin: '2023-06-09T16:30:00',
        phoneNumber: '+31698765432'
      },
      {
        id: '3',
        firstName: 'Maria',
        lastName: 'de Vries',
        email: 'maria.devries@example.com',
        role: 'user',
        created: '2023-03-05T09:45:00',
        lastLogin: '2023-06-08T11:20:00',
        phoneNumber: '+31611112222'
      },
      {
        id: '4',
        firstName: 'Pieter',
        lastName: 'Bakker',
        email: 'pieter.bakker@example.com',
        role: 'pharmacist',
        created: '2023-04-12T13:10:00',
        lastLogin: '2023-06-11T09:15:00',
        phoneNumber: '+31633334444'
      },
      {
        id: '5',
        firstName: 'Sophie',
        lastName: 'Visser',
        email: 'sophie.visser@example.com',
        role: 'user',
        created: '2023-05-18T11:25:00',
        phoneNumber: ''
      }
    ]);
  };
    useEffect(() => {
    // Debug authentication state
    const token = localStorage.getItem('igs_auth_token');
    const userData = localStorage.getItem('igs_user_data');
    console.log('AdminUsersPanel - Auth token present:', !!token);
    console.log('AdminUsersPanel - User data present:', !!userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('AdminUsersPanel - User role:', user.role);
        console.log('AdminUsersPanel - Is admin/superadmin:', 
          user.role === 'admin' || user.role === 'superadmin');
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
    
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
  };  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Weet je zeker dat je deze gebruiker wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')) {
      try {
        try {          // Get authentication headers using our helper function
          const config = getAuthHeaders();
          console.log('Auth header for delete:', !!config.headers.Authorization);
          
          // Try to call the API (if it exists)
          console.log('Deleting user with ID:', userId);
          console.log('Delete URL:', `${API_BASE_URL}/Auth/users/${userId}`);
          
          const response = await axios.delete(`${API_BASE_URL}/Auth/users/${userId}`, config);
          console.log('Delete user successful:', response.data);
          // If successful, refresh the user list
          fetchUsers();
          alert('Gebruiker is succesvol verwijderd.');
        } catch (apiErr: any) {
          console.warn('API delete failed:', apiErr);
          
          if (apiErr.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (apiErr.response.status === 404) {
              alert('Deze gebruiker kon niet worden gevonden.');
            } else if (apiErr.response.status === 400 && apiErr.response.data.message) {
              alert(`Fout: ${apiErr.response.data.message}`);
            } else {
              alert('Er is een fout opgetreden bij het verwijderen van de gebruiker.');
            }
          } else {
            console.warn('Removing from local state instead');
            // Fall back to local state management
            setUsers(users.filter(user => user.id !== userId));
            alert('Gebruiker verwijderd (alleen in lokale weergave).');
          }
        }
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
      'superadmin': 'Super Admin'
    };
    
    return roleMap[role.toLowerCase()] || role;
  };
  
  // Handle form submission for creating or updating a user
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Get form data
    const form = e.target as HTMLFormElement;
    const firstName = (form.querySelector('#firstName') as HTMLInputElement).value;
    const lastName = (form.querySelector('#lastName') as HTMLInputElement).value;
    const email = (form.querySelector('#email') as HTMLInputElement).value;
    const role = (form.querySelector('#role') as HTMLSelectElement).value;
    const phoneNumber = (form.querySelector('#phoneNumber') as HTMLInputElement)?.value || '';
    
    // Validate form data
    if (!firstName || !lastName || !email || !role) {
      alert('Alle velden zijn verplicht');
      return;
    }

    if (modalMode === 'create') {
      // Get password fields for create mode
      const password = (form.querySelector('#password') as HTMLInputElement).value;
      const confirmPassword = (form.querySelector('#confirmPassword') as HTMLInputElement).value;
      
      // Validate passwords
      if (!password || password.length < 8) {
        alert('Wachtwoord moet minimaal 8 tekens bevatten');
        return;
      }
      
      if (password !== confirmPassword) {
        alert('Wachtwoorden komen niet overeen');
        return;
      }
      
      // Create new user
      try {
        // Try API call first
        try {          const response = await axios.post(`${API_BASE_URL}/Auth/register`, {
            firstName,
            lastName,
            email,
            password,
            confirmPassword: password,
            role
          }, getAuthHeaders());
          
          console.log('User creation successful:', response.data);
          // If successful, refresh the user list
          fetchUsers();
          setIsModalOpen(false);
          alert('Gebruiker is succesvol aangemaakt.');
        } catch (apiErr) {
          console.warn('API create failed, adding to local state instead:', apiErr);
          
          // Fall back to local state management
          const newUser: User = {
            id: `temp-${Date.now()}`, // Generate a temporary ID
            firstName,
            lastName,
            email,
            role,
            created: new Date().toISOString(),
            lastLogin: undefined
          };
          
          setUsers([...users, newUser]);
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error('Error creating user:', err);
        alert('Er is een fout opgetreden bij het aanmaken van de gebruiker. Probeer het later opnieuw.');
      }
    } else if (modalMode === 'edit' && selectedUser) {
      // Update existing user
      try {
        // Try API call first
        try {
          console.log('Updating user with ID:', selectedUser.id);
          const updatePayload = {
            firstName,
            lastName,
            role,
            phoneNumber: phoneNumber || '', // Ensure phoneNumber is always a string
            userId: selectedUser.id // Include userId as it's expected by the backend
          };          console.log('Update payload:', updatePayload);          
          console.log('Update URL:', `${API_BASE_URL}/Auth/users/${selectedUser.id}`);
            // Get authentication headers using our helper function
          const config = getAuthHeaders();
          console.log('Auth header for update:', !!config.headers.Authorization);
          
          // Add timeout to config
          const configWithTimeout = {
            ...config,
            timeout: 10000 // 10 second timeout
          };
          
          // Make the API call with proper authentication
          const response = await axios.put(
            `${API_BASE_URL}/Auth/users/${selectedUser.id}`, 
            updatePayload,
            configWithTimeout
          );
          
          console.log('Update response:', response.data);
          // If successful, refresh the user list
          fetchUsers();
          setIsModalOpen(false);
          alert('Gebruiker is succesvol bijgewerkt.');
        } catch (apiErr: any) {
          console.warn('API update failed:', apiErr);

          if (apiErr.response) {
            console.error('API Error Response:', apiErr.response.status, apiErr.response.data);
            console.error('Error Response URL:', apiErr.config?.url);
            console.error('Error Response Method:', apiErr.config?.method);
            console.error('Error Response Headers:', apiErr.config?.headers);
            console.error('Error Response Data:', apiErr.config?.data);

            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (apiErr.response.status === 404) {
              alert('Deze gebruiker kon niet worden gevonden of de API endpoint bestaat niet.');
            } else if (apiErr.response.status === 400 && apiErr.response.data.message) {
              alert(`Fout: ${apiErr.response.data.message}`);
            } else {
              alert(`Er is een fout opgetreden bij het bijwerken van de gebruiker. Status: ${apiErr.response.status}`);
              console.warn('Updating local state instead');
              
              // Fall back to local state management
              const updatedUsers = users.map(user => {
                if (user.id === selectedUser?.id) {
                  return {
                    ...user,
                    firstName,
                    lastName,
                    email,
                    role
                  };
                }
                return user;
              });
              
              setUsers(updatedUsers);
              setIsModalOpen(false);
            }          } else {
            console.warn('Updating local state instead');
            console.log('Update payload for local state:', { 
              firstName, lastName, email, role, phoneNumber, 
              id: selectedUser?.id 
            });
            
            // Fall back to local state management
            const updatedUsers = users.map(user => {
              if (user.id === selectedUser?.id) {
                return {
                  ...user,
                  firstName,
                  lastName,
                  email,
                  role,
                  phoneNumber
                };
              }
              return user;
            });
            
            setUsers(updatedUsers);
            setIsModalOpen(false);
          }
        }
      } catch (err) {
        console.error('Error updating user:', err);
        alert('Er is een fout opgetreden bij het bijwerken van de gebruiker. Probeer het later opnieuw.');
      }
    }
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
                  </div>                  <div className="admin-users-modal-field">
                    <label>Rol:</label>
                    <p>{translateRole(selectedUser.role)}</p>
                  </div>
                  <div className="admin-users-modal-field">
                    <label>Telefoonnummer:</label>
                    <p>{selectedUser.phoneNumber || 'Niet opgegeven'}</p>
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
                <form id="user-form" className="admin-users-modal-form" onSubmit={handleFormSubmit}>
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
                  </div>                  <div className="admin-users-modal-form-group">
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
                  <div className="admin-users-modal-form-group">
                    <label htmlFor="phoneNumber">Telefoonnummer</label>
                    <input 
                      type="tel" 
                      id="phoneNumber" 
                      defaultValue={selectedUser?.phoneNumber || ''}
                    />
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
                  </button>                  <button 
                    className="admin-users-modal-button primary"
                    type="submit"
                    form="user-form"
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
