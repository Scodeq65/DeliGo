// src/components/Admin/OrderManagement.js
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch orders from the admin endpoint
  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/admin/orders'); // Ensure this endpoint exists
      // Assume response data is in res.data.data or simply res.data
      setOrders(res.data.data || res.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle status change for a given order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Update the order status via the orders endpoint
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      // Refresh the orders list after a successful update
      fetchOrders();
    } catch (err) {
      setError('Error updating order status');
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Order Management</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Restaurant ID</th>
              <th>Total Amount</th>
              <th>Delivery Address</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_id}</td>
                <td>{order.restaurant_id}</td>
                <td>${order.total_amount}</td>
                <td>{order.delivery_address}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.order_id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManagement;
