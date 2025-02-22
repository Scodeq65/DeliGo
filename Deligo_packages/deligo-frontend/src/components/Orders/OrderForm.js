import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import api from '../../services/api';

const OrderForm = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In a full implementation, order items would be dynamically added.
    // Here we use a placeholder order item.
    const orderData = {
      restaurant_id: parseInt(restaurantId),
      delivery_address: deliveryAddress,
      items: [{ dish_id: 1, quantity: 2 }] // Placeholder item data
    };

    try {
      await api.post('/api/orders/', orderData);
      setMessage('Order created successfully!');
      // Optionally clear form fields here.
    } catch (error) {
      console.error('Error creating order:', error);
      setMessage('Error creating order.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Place an Order</Typography>
      {message && <Typography color="primary">{message}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Restaurant ID"
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Submit Order
        </Button>
      </form>
    </Box>
  );
};

export default OrderForm;
