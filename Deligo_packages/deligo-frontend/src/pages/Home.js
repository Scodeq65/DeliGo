// src/pages/Home.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3">Welcome to Deligo Food Delivery App</Typography>
      <Typography variant="body1">Order your favorite food from the best restaurants around!</Typography>
    </Box>
  );
};

export default Home;
