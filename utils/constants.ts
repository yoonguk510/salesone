// API endpoints and constants - using relative URLs for proxy support
export const API_BASE_URL = '/api'; // Changed from absolute URL to relative path

// Authentication related endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  OAUTH_ENDPOINT: `${API_BASE_URL}/auth/oauth/endpoint`,
  OAUTH_TOKEN: `${API_BASE_URL}/auth/oauth/token`,
};

// Token storage keys
export const TOKEN_KEY = 'salesone_auth_token';
export const USER_KEY = 'salesone_user';

// Authentication timeout/expiry (in milliseconds)
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry