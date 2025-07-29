import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, [token]);

  
  useEffect(() => {
    const interceptor = api.interceptors.request.use(config => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        config.headers.Authorization = `Bearer ${savedToken}`;
      }
      return config;
    });
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, []);

  
  const login = async (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const res = await api.post('/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    setToken(res.data.access_token);
  };


  const logout = () => {
    setToken(null);
  };


  const register = async (username, password, adminUsername, adminPassword) => {
    await api.post('/register', {
      adminUsername,
      adminPassword,
      username,
      password,
    });
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
