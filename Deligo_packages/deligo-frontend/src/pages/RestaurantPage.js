// src/pages/RestaurantPage.js
import React from 'react';
import RestaurantDetail from '../components/Restaurants/RestaurantDetail';

const RestaurantPage = () => {
  return (
    <div>
      <h2>Restaurant Detail</h2>
      {/* This component will later display details for a specific restaurant */}
      <RestaurantDetail />
    </div>
  );
};

export default RestaurantPage;
