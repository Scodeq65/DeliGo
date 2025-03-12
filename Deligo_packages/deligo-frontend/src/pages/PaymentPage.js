// src/pages/PaymentPage.js
import React from 'react';
import PayPalButton from '../components/Payment/PayPalButton';

const PaymentPage = () => {
  // For demonstration, we use static orderId and amount
  const orderId = 123;
  const amount = 49.99;

  return (
    <div>
      <h2>Complete Your Payment</h2>
      <PayPalButton orderId={orderId} amount={amount} />
    </div>
  );
};

export default PaymentPage;
