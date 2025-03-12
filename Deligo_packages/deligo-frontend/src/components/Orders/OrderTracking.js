// src/components/Orders/OrderTracking.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LinearProgress from '@mui/material/LinearProgress';

const SOCKET_SERVER_URL = 'http://127.0.0.1:5000';
const socket = io(SOCKET_SERVER_URL);

const OrderTracking = ({ orderId }) => {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    // Join the order room
    socket.emit('joinOrderRoom', { order_id: orderId });

    // Listen for order status updates
    socket.on('orderStatusUpdate', (data) => {
      if (data.order_id === orderId) {
        setStatus(data.status);
        toast.info(`Order ${orderId} is now ${data.status}`);
      }
    });

    return () => {
      socket.off('orderStatusUpdate');
    };
  }, [orderId]);

  // Map order status to progress value (for example purposes)
  const getProgress = (status) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'preparing': return 70;
      case 'out_for_delivery': return 90;
      case 'delivered': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  return (
    <div>
      <h3>Order Tracking for Order #{orderId}</h3>
      <LinearProgress variant="determinate" value={getProgress(status)} />
      <p>Status: {status}</p>
      <ToastContainer />
    </div>
  );
};

export default OrderTracking;
