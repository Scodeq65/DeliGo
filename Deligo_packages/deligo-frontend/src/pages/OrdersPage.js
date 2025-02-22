// src/pages/OrdersPage.js
import React from 'react';
import OrderHistory from '../components/Orders/OrderHistory';

const OrdersPage = () => {
  return (
    <div>
      <h2>Your Orders</h2>
      {/* This component will later display the user's order history */}
      <OrderHistory />
    </div>
  );
};

export default OrdersPage;
