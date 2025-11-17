import axios from 'axios';

const api = axios.create({
  // Use the OData V4 service path exposed by the CAP server
  baseURL: 'http://localhost:4004/odata/v4/maintenance',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true
});

// Set Authorization header from localStorage if present
const stored = localStorage.getItem('auth');
if (stored) {
  api.defaults.headers.Authorization = `Basic ${stored}`;
} else {
  // fallback to any:any to keep dev server behaving when no login performed
  api.defaults.headers.Authorization = `Basic ${btoa('any:any')}`;
}

// Single request interceptor for logs
api.interceptors.request.use(
  config => {
    // ensure Authorization header is current (read from localStorage)
    const token = localStorage.getItem('auth');
    if (token) config.headers.Authorization = `Basic ${token}`;
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => Promise.reject(error)
);

// Single response interceptor for logging and normalized errors
api.interceptors.response.use(
  response => {
    // keep useful logs in development
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.message, error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export default api;