import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../infrastructure/services/ApiConfig';

// Auth endpoints
const AUTH_ENDPOINT = `${API_BASE_URL}/Auth`; // Note the capital 'A' to match backend controller route

// Define user interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'customer' | 'pharmacist' | 'admin' | 'superadmin' | 'beheerder';
  prescriptionAccess?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
}

// Register data interface
export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('igs_auth_token');
        
        if (token) {
          console.log('Found auth token, setting up authorization headers');
          // Set authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Check if we have cached user data
          const userData = localStorage.getItem('igs_user_data');
          
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              console.log('User authenticated from localStorage:', parsedUser.email);
              
              // Create a new axios instance with the token to ensure it's used for this request
              const axiosWithAuth = axios.create({
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              // In the background, still validate the token with the server
              // but don't block the UI on this request
              axiosWithAuth.get(`${AUTH_ENDPOINT}/me`)
                .then(response => {
                  if (response.data) {
                    // Update with fresh data from server
                    setUser(response.data);
                    // Update cached user data
                    localStorage.setItem('igs_user_data', JSON.stringify(response.data));
                    console.log('Token validation successful, user data updated');
                    
                    // Ensure global axios headers are updated
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                  }
                })
                .catch(err => {
                  console.warn('Token validation failed, but keeping user logged in:', err);
                  // Don't clear auth data on validation failure
                  // This allows the user to stay logged in even if the server is temporarily unavailable
                  // The cached user data will be used instead
                });
            } catch (parseError) {
              console.error('Error parsing cached user data:', parseError);
              localStorage.removeItem('igs_user_data');
              setUser(null);
            }
          } else {
            // No cached user data, must validate with server
            try {
              // Create a new axios instance with the token to ensure it's used for this request
              const axiosWithAuth = axios.create({
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              const response = await axiosWithAuth.get(`${AUTH_ENDPOINT}/me`);
              if (response.data) {
                setUser(response.data);
                // Cache the user data
                localStorage.setItem('igs_user_data', JSON.stringify(response.data));
                // Ensure global axios headers are updated
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              }
            } catch (error) {
              console.error('Token validation failed:', error);
              // Clear auth data on validation failure
              localStorage.removeItem('igs_auth_token');
              localStorage.removeItem('igs_refresh_token');
              delete axios.defaults.headers.common['Authorization'];
              setUser(null);
            }
          }
        } else {
          // No token found, user is not authenticated
          setUser(null);
          console.log('No authentication token found');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('igs_auth_token');
        localStorage.removeItem('igs_user_data');
        localStorage.removeItem('igs_refresh_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call the login API endpoint
      const response = await axios.post(`${AUTH_ENDPOINT}/login`, {
        email,
        password,
        rememberMe
      });
      
      if (response.data && response.data.success) {
        // Store auth data
        localStorage.setItem('igs_auth_token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('igs_refresh_token', response.data.refreshToken);
        }
        
        // Store user data in localStorage for persistence
        if (response.data.user) {
          localStorage.setItem('igs_user_data', JSON.stringify(response.data.user));
        }
        
        // Save email if rememberMe is true
        if (rememberMe) {
          localStorage.setItem('igs_remembered_email', email);
        } else {
          localStorage.removeItem('igs_remembered_email');
        }
        
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Set user state
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Registering user with endpoint:', `${AUTH_ENDPOINT}/register`);
      console.log('Registration data:', { ...userData, password: '[REDACTED]', confirmPassword: '[REDACTED]' });
      
      // Call the register API endpoint
      const response = await axios.post(`${AUTH_ENDPOINT}/register`, userData);
      
      console.log('Registration API response:', response.data);
      
      if (response.data && response.data.success) {
        // Store auth data
        localStorage.setItem('igs_auth_token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('igs_refresh_token', response.data.refreshToken);
        }
        
        // Store user data in localStorage for persistence
        if (response.data.user) {
          localStorage.setItem('igs_user_data', JSON.stringify(response.data.user));
        }
        
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Set user state
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration failed:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Logout function
  const logout = () => {
    try {
      // First reset user state
      setUser(null);
      
      // Then clear all auth-related data from localStorage
      localStorage.removeItem('igs_auth_token');
      localStorage.removeItem('igs_refresh_token');
      localStorage.removeItem('igs_user_data');
      localStorage.removeItem('igs_remembered_email');
      
      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still attempt to reset user state even if localStorage operations fail
      setUser(null);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('igs_auth_token');
      if (!token) {
        console.error('No authentication token found');
        return false;
      }
      
      // Debug token information
      console.log('Token from localStorage:', token.substring(0, 20) + '...');
      
      // Try to decode the token to see what's inside (JWT tokens are base64 encoded)
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token payload:', payload);
          console.log('User ID in token:', payload.sub || payload.nameid || payload.userId || 'Not found');
        } else {
          console.error('Token does not appear to be in valid JWT format');
        }
      } catch (e) {
        console.error('Error decoding token:', e);
      }

      // Create a new axios instance with the token to ensure it's used for this request
      const axiosWithAuth = axios.create({
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Make sure we have the required fields according to UpdateUserRequest in the backend
      // Include the user ID to help with identification on the backend
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || '',
        // Include user ID if available - use the correct property name to match the backend model
        // The backend expects 'userId' to be 'UserId' (capital U) to match the C# property name
        userId: userData.id || user?.id || ''
      };
      
      // Log the user ID for debugging
      console.log('User ID being sent:', updateData.userId);
      
      // Create a new object with the correct property name to match the backend model
      const backendData = {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        phoneNumber: updateData.phoneNumber || '',
        // Use capital U for UserId to match C# property name
        UserId: updateData.userId
      };
      
      console.log('Current user state in context:', user);
      console.log('Sending data to backend with UserId:', backendData.UserId);
      
      console.log('API endpoint:', `${AUTH_ENDPOINT}/me`);
      console.log('Authorization header:', `Bearer ${token.substring(0, 10)}...`);
      
      // Call the update profile API endpoint with the dedicated axios instance and the correct data
      const response = await axiosWithAuth.put(`${AUTH_ENDPOINT}/me`, backendData);
      
      console.log('Profile update response status:', response.status);
      console.log('Profile update response data:', response.data);
      
      if (response.data) {
        // Create a new user object with updated data
        const updatedUser = user ? {
          ...user,
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          phoneNumber: updateData.phoneNumber
        } : response.data;
        
        // Update the user state
        setUser(updatedUser);
        console.log('Updated user state:', updatedUser);
        
        // Update local storage with the new user data
        localStorage.setItem('igs_user_data', JSON.stringify(updatedUser));
        console.log('Updated localStorage user data');
        
        // Also update the global axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Profile update failed:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        // IMPORTANT: Don't automatically log out on 401 errors
        // Just report the error and let the component handle it
        // This prevents the automatic logout issue
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error; // Re-throw to allow component to handle the error
    } finally {
      setIsLoading(false);
    }
  };
  
  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call the forgot password API endpoint
      const response = await axios.post(`${AUTH_ENDPOINT}/forgot-password`, { email });
      console.log('Forgot password response:', response.data);
      if (response.status !== 200) {
        console.error('Forgot password request failed with status:', response.status);
        return false;
      }
      return true; // API always returns success for security reasons
    } catch (error) {
      console.error('Forgot password request failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password function
  const resetPassword = async (
    token: string,
    email: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call the reset password API endpoint
      const response = await axios.post(`${AUTH_ENDPOINT}/reset-password`, {
        token,
        email,
        newPassword,
        confirmNewPassword
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Password reset failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Change password function
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Call the change password API endpoint
      const response = await axios.post(`${AUTH_ENDPOINT}/change-password`, {
        currentPassword,
        newPassword,
        confirmNewPassword
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Password change failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Compute isAuthenticated once to ensure consistency
  const isAuthenticated = !!user && !!localStorage.getItem('igs_auth_token');
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
