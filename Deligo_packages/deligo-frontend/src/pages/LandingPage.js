// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const LandingPage = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Deligo
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your premier food delivery service. Please log in or register to get started.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mr: 2 }}>
          Login
        </Button>
        <Button variant="outlined" color="primary" component={Link} to="/register">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
