import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { token, userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  // Determine dashboard route based on role.
  const dashboardLink = userInfo && userInfo.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Deligo Food Delivery
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/restaurants">Restaurants</Button>
        <Button color="inherit" component={Link} to="/orders">Orders</Button>
        {token ? (
          <>
            <Button color="inherit" onClick={handleMenuOpen}>
              {userInfo ? `Welcome, ${userInfo.name}` : 'Dashboard'}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem component={Link} to={dashboardLink} onClick={handleMenuClose}>
                My Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
