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
  role: 'customer' | 'pharmacist' | 'admin';
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
      setIsLoading(true);
      try {
        // Check localStorage for saved auth token
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token) {
          // Configure axios to use the token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // First try to use cached user data if available
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              console.log('User authenticated from localStorage:', parsedUser.email);
              
              // In the background, still validate the token with the server
              // but don't block the UI on this request
              axios.get(`${AUTH_ENDPOINT}/me`)
                .then(response => {
                  if (response.data) {
                    // Update with fresh data from server
                    setUser(response.data);
                    // Update cached user data
                    localStorage.setItem('user_data', JSON.stringify(response.data));
                    console.log('Token validation successful, user data updated');
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
              localStorage.removeItem('user_data');
              setUser(null);
            }
          } else {
            // No cached user data, must validate with server
            try {
              const response = await axios.get(`${AUTH_ENDPOINT}/me`);
              if (response.data) {
                setUser(response.data);
                // Cache the user data
                localStorage.setItem('user_data', JSON.stringify(response.data));
              }
            } catch (error) {
              console.error('Token validation failed:', error);
              // Clear auth data on validation failure
              localStorage.removeItem('auth_token');
              localStorage.removeItem('refresh_token');
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
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('refresh_token');
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
        localStorage.setItem('auth_token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
        
        // Store user data in localStorage for persistence
        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
        }
        
        // Save email if rememberMe is true
        if (rememberMe) {
          localStorage.setItem('remembered_email', email);
        } else {
          localStorage.removeItem('remembered_email');
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
        localStorage.setItem('auth_token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
        
        // Store user data in localStorage for persistence
        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user));
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
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      
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
      // Call the update profile API endpoint
      const response = await axios.put(`${AUTH_ENDPOINT}/me`, userData);
      
      if (response.data) {
        setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
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
  const isAuthenticated = !!user && !!localStorage.getItem('auth_token');
  
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
