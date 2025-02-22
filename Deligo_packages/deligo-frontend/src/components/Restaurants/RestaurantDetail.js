import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/api/restaurants/${id}`);
        setRestaurant(res.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (!restaurant) {
    return <Typography>Loading restaurant details...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{restaurant.name}</Typography>
      <Typography variant="body1">{restaurant.description}</Typography>
      <Typography variant="body2">Address: {restaurant.address}</Typography>
      <Typography variant="body2">Phone: {restaurant.phone}</Typography>
      {/* Optionally, include a Menu component here */}
    </Box>
  );
};

export default RestaurantDetail;
