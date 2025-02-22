// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Connect to backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Utility function to set Authorization token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
