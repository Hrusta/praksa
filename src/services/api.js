import axios from 'axios';


const initialToken = localStorage.getItem('token') || '';


const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: initialToken
    ? { Authorization: `Bearer ${initialToken}` }
    : {},
});


api.interceptors.request.use(config => {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    config.headers.Authorization = `Bearer ${savedToken}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
