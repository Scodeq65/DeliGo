// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantPage from './pages/RestaurantPage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MenuManagement from './components/Admin/MenuManagement';
import OrderManagement from './components/Admin/OrderManagement';
import Analytics from './components/Admin/Analytics';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminDashboard />}>
              <Route path="menu" element={<MenuManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route index element={<div>Welcome, Admin!</div>} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
