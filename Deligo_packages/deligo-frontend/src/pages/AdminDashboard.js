import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, Outlet, Navigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const AdminDashboard = () => {
  const { userInfo } = useContext(AuthContext);

  if (!userInfo || userInfo.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Box>
      <Typography variant="h5" sx={{ p: 2 }}>
        Welcome, {userInfo.name} (Admin)
      </Typography>
      <Box sx={{ display: 'flex' }}>
        <aside style={{ width: '200px', padding: '1rem', background: '#f4f4f4' }}>
          <Typography variant="h6" gutterBottom>
            Admin Dashboard
          </Typography>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="menu">Menu Management</Link></li>
            <li><Link to="orders">Order Management</Link></li>
            <li><Link to="analytics">Analytics</Link></li>
          </ul>
        </aside>
        <main style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </main>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
