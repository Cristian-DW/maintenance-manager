import axios from 'axios';

const api = axios.create({
  // Use the base URL for the CAP server - routes will include the full path
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4004',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true
});

// Simple in-memory cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(config) {
  return `${config.method}:${config.url}`;
}

function isCacheValid(timestamp) {
  return Date.now() - timestamp < CACHE_DURATION;
}

// Don't set default Authorization header - will be handled by interceptor

// Single request interceptor for logs and caching
api.interceptors.request.use(
  config => {
    // Special handling for authenticate endpoint - don't send Authorization header
    if (config.url && config.url.includes('/authenticate')) {
      delete config.headers.Authorization;
    } else {
      // Use JWT access token for other requests
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add /odata/v4/maintenance prefix to API routes only if needed
    // Skip if URL already contains /odata/ or is an absolute path
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/odata')) {
      config.url = `/odata/v4/maintenance${config.url.startsWith('/') ? config.url : '/' + config.url}`;
    }

    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Single response interceptor for logging and normalized errors
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.message, error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

// Export cache clearing utility
export function clearCache() {
  cache.clear();
}

export default api;