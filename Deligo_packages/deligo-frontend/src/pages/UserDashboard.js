import React, { useContext } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserDashboard = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {userInfo?.name || "User"}
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is your dashboard. Here you can create orders, view order history, update your profile, and more.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" component={Link} to="/orders" sx={{ mr: 2 }}>
            View Orders
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/restaurants">
            Browse Restaurants
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserDashboard;
