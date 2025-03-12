// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { setAuthToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      try {
        const decoded = jwtDecode(token);
        setUserInfo({
          role: decoded.role || 'user',
          name: decoded.name || '',
          id: decoded.sub || decoded.identity,
        });
      } catch (error) {
        console.error("Token decode error:", error);
      }
    } else {
      setUserInfo(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ token, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
