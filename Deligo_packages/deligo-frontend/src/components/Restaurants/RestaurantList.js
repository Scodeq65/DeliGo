import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/api/restaurants/');
        console.log("API response:", res.data);
        console.log("Type of res.data.data:", typeof res.data.data, "Array?", Array.isArray(res.data.data));

        // Check if res.data.data is an array:
        if (Array.isArray(res.data.data)) {
          setRestaurants(res.data.data);
        } else if (Array.isArray(res.data)) {
          setRestaurants(res.data);
        } else {
          console.error("Invalid response from API:", res.data);
          setRestaurants([]); // Reset restaurants to empty array
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Restaurants</Typography>
      {restaurants.length === 0 ? (
        <Typography>No restaurants available.</Typography>
      ) : (
        <List>
          {restaurants.map((restaurant) => (
            <ListItem key={restaurant.restaurant_id}>
              <ListItemText
                primary={restaurant.name}
                secondary={restaurant.description}
              />
              <Link to={`/restaurant/${restaurant.restaurant_id}`}>View Details</Link>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default RestaurantList;
