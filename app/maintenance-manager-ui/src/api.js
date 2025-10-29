import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4004/maintenance',
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: 'admin',
    password: 'admin'
  }
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;