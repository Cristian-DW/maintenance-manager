import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4004/maintenance',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: false,
});

// Add basic auth to all requests (CAP mock auth requires it)
api.interceptors.request.use(
  config => {
    const auth = btoa('any:any');
    config.headers.Authorization = `Basic ${auth}`;
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.message);
    console.error('Error code:', error.code);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

export default api;