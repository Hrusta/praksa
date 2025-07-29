import axios from 'axios';


const initialToken = localStorage.getItem('token') || '';


const api = axios.create({
  baseURL: 'https://praksa-th8k.onrender.com',
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
