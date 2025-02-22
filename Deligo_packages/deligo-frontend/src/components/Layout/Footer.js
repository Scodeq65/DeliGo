// src/components/Layout/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, backgroundColor: '#1976d2', color: '#fff', textAlign: 'center' }}>
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Deligo Food Delivery. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
