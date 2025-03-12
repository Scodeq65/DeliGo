# routes/payment.py
from flask import Blueprint, request, jsonify
import requests
from Deligo_packages.config import Config
from flask_jwt_extended import jwt_required

payment_bp = Blueprint('payment', __name__, url_prefix='/api/payments')

PAYPAL_CLIENT_ID = Config.PAYPAL_CLIENT_ID
PAYPAL_SECRET = Config.PAYPAL_SECRET
PAYPAL_API = "https://api.sandbox.paypal.com"

def get_paypal_token():
    auth_response = requests.post(
        f"{PAYPAL_API}/v1/oauth2/token",
        headers={"Accept": "application/json", "Accept-Language": "en_US"},
        data={"grant_type": "client_credentials"},
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET)
    )
    return auth_response.json().get("access_token")

@payment_bp.route('/charge', methods=['POST'])
@jwt_required()
def create_payment():
    data = request.get_json()
    order_id = data.get("order_id")
    amount = data.get("amount")
    currency = data.get("currency", "USD")

    paypal_token = get_paypal_token()

    # Create a payment using PayPal's API
    payment_payload = {
        "intent": "sale",
        "redirect_urls": {
            "return_url": "http://localhost:3000/payment/success",  # Adjust as needed
            "cancel_url": "http://localhost:3000/payment/cancel"
        },
        "payer": {"payment_method": "paypal"},
        "transactions": [{
            "amount": {"total": str(amount), "currency": currency},
            "description": f"Payment for Order #{order_id}"
        }]
    }

    response = requests.post(
        f"{PAYPAL_API}/v1/payments/payment",
        json=payment_payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {paypal_token}"
        }
    )

    return jsonify(response.json()), response.status_code
