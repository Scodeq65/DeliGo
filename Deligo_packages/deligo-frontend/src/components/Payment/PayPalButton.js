// src/components/Payment/PayPalButton.js
import React, { useEffect, useRef } from 'react';
// import api from '../../services/api';

const PayPalButton = ({ orderId, amount }) => {
  const paypalRef = useRef();

  useEffect(() => {
    // Render the PayPal button into #paypal-button-container
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        // Set up the transaction details
        return actions.order.create({
          purchase_units: [{
            description: `Payment for Order #${orderId}`,
            amount: {
              currency_code: "USD",
              value: amount.toString(),
            },
          }],
        });
      },
      onApprove: async (data, actions) => {
        // Capture the funds from the transaction
        const order = await actions.order.capture();
        console.log("Payment successful:", order);
        // Optionally, notify your backend to update order payment status
      },
      onError: (err) => {
        console.error("PayPal Checkout error", err);
      }
    }).render(paypalRef.current);
  }, [orderId, amount]);

  return (
    <div>
      <div ref={paypalRef} />
    </div>
  );
};

export default PayPalButton;
