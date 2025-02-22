// src/pages/RestaurantsPage.js
import React from 'react';
import RestaurantList from '../components/Restaurants/RestaurantList';

const RestaurantsPage = () => {
  return (
    <div>
      <h2>Restaurants</h2>
      {/* This component will later display the list of restaurants */}
      <RestaurantList />
    </div>
  );
};

export default RestaurantsPage;
