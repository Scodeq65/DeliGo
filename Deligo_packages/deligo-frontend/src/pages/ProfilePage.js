// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/users/profile');
        setProfile(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error('Error fetching profile', err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders/my-orders');
        setOrders(res.data.data);
      } catch (err) {
        console.error('Error fetching orders', err);
      }
    };

    fetchProfile();
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/api/users/profile', formData);
      setProfile(res.data);
      setEditing(false);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div>
      <h2>My Profile</h2>
      {profile ? (
        <div>
          {editing ? (
            <form onSubmit={handleUpdate}>
              <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
              </div>
              <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
              </div>
              <div>
                <label>Address:</label>
                <textarea name="address" value={formData.address || ''} onChange={handleChange} />
              </div>
              <button type="submit">Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            </div>
          )}
          {message && <p>{message}</p>}

          <h3>Order History</h3>
          {orders.length > 0 ? (
            <ul>
              {orders.map(order => (
                <li key={order.order_id}>
                  Order #{order.order_id} - {order.status} - Total: ${order.total_amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders yet.</p>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;
