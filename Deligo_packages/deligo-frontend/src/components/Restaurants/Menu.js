import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const Menu = () => {
  const { id } = useParams(); // Restaurant ID from route params
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get(`/api/restaurants/${id}/menu`);
        setMenu(res.data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
    fetchMenu();
  }, [id]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Menu</Typography>
      {menu.length === 0 ? (
        <Typography>No menu items available.</Typography>
      ) : (
        <List>
          {menu.map((item) => (
            <ListItem key={item.dish_id}>
              <ListItemText primary={item.name} secondary={`Price: $${item.price}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Menu;
