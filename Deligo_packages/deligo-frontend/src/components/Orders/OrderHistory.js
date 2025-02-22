import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import api from '../../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/my-orders');
        // Adjust according to your API response shape.
        setOrders(res.data.data || res.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Order History</Typography>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <ListItem key={order.order_id}>
              <ListItemText
                primary={`Order #${order.order_id} - ${order.status}`}
                secondary={`Total: $${order.total_amount} - Delivery: ${order.delivery_address}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default OrderHistory;
