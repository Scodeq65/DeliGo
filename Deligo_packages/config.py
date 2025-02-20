import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "fallback_secret_key"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///fooddelivery.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
