import axios from 'axios';

const api = axios.create({
  // Use the base URL for the CAP server - routes will include the full path
  baseURL: 'http://localhost:4004',
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

// Set Authorization header from localStorage if present
const stored = localStorage.getItem('auth');
if (stored) {
  api.defaults.headers.Authorization = `Bearer ${stored}`;
} else {
  // fallback to any:any to keep dev server behaving when no login performed
  api.defaults.headers.Authorization = `Bearer ${btoa('any:any')}`;
}

// Single request interceptor for logs and caching
api.interceptors.request.use(
  config => {
    // ensure Authorization header is current (read from localStorage)
    const token = localStorage.getItem('auth');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // Add /odata/v4/maintenance prefix to API routes (but not authenticate which is at root)
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/odata')) {
      if (config.url !== '/odata/v4/maintenance/authenticate') {
        config.url = `/odata/v4/maintenance${config.url.startsWith('/') ? config.url : '/' + config.url}`;
      }
    }
    
    // Check cache for GET requests
    if (config.method === 'get') {
      const cacheKey = getCacheKey(config);
      const cached = cache.get(cacheKey);
      if (cached && isCacheValid(cached.timestamp)) {
        console.log('API Cache Hit:', config.url);
        return Promise.reject(new Error('__CACHE__:' + cacheKey));
      }
    }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    if (error.message?.startsWith('__CACHE__:')) {
      const cacheKey = error.message.split(':')[1];
      return Promise.resolve(cache.get(cacheKey).data);
    }
    return Promise.reject(error);
  }
);

// Single response interceptor for logging and normalized errors
api.interceptors.response.use(
  response => {
    // Cache successful GET responses
    if (response.config.method === 'get') {
      const cacheKey = getCacheKey(response.config);
      cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
    }
    
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