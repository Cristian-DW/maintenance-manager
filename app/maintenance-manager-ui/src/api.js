import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4004/odata/v4/maintenance/',
});

export default api;