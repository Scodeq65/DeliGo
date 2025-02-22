// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(localStorage.getItem('access_token'));

  // Whenever the token changes, update the Axios header
  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  const login = (token, userData) => {
    localStorage.setItem('access_token', token);
    setAccessTokenState(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setAccessTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
