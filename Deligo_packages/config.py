import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables from the .env file
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "fallback_secret_key"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///fooddelivery.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "fallback_secret_key"

# PayPal configuration
    PAYPAL_CLIENT_ID = os.environ.get("PAYPAL_CLIENT_ID")
    PAYPAL_SECRET = os.environ.get("PAYPAL_SECRET")
    PAYPAL_API_BASE = os.environ.get("PAYPAL_API_BASE") or "https://api.sandbox.paypal.com"
    