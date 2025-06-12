// frontend/src/infrastructure/services/ApiConfig.ts

// Use the correct API URL based on environment
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://igs.asafarim.com/api' // Use relative URL in production (will be handled by nginx)
  : 'http://localhost:6200/api';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const AUTH_CONFIG = {
  loginEndpoint: '/auth/login',
  registerEndpoint: '/auth/register',
  refreshEndpoint: '/auth/refresh',
  logoutEndpoint: '/auth/logout'
};