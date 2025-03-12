// src/components/Admin/MenuManagement.js
import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const MenuManagement = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/api/restaurants/');
        setRestaurants(res.data);
      } catch (err) {
        console.error('Error fetching restaurants', err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      <h2>Menu Management</h2>
      {restaurants.map((r) => (
        <div key={r.restaurant_id}>
          <h3>{r.name}</h3>
          {/* Include controls for adding/updating/deleting dishes */}
        </div>
      ))}
    </div>
  );
};

export default MenuManagement;
