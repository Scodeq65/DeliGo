// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api, { setAuthToken } from '../../services/api';
import { TextField, Button, Box, Typography } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { access_token } = res.data;
      localStorage.setItem('access_token', access_token);
      setAuthToken(access_token);

      // Decode the token to get the user's role
      const decoded = jwtDecode(access_token);
      const userRole = decoded.role || 'user';

      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin/menu');  // Redirect to the admin dashboard
      } else {
        navigate('/dashboard');  // Redirect to the general client homepage/dashboard
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
