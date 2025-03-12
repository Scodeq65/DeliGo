from flask import Blueprint, request, jsonify
from Deligo_packages.extensions import db
from Deligo_packages.models import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/')
def home():
    """Homepage route."""
    return jsonify({"message": "Welcome to DeliGo Food Delivery App"})


@auth_bp.route('/register', methods=['POST'])
def register():
    """Registers a new user."""
    data = request.get_json()

    # print("Received JSON:", data)

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    address = data.get("address")
    role = data.get("role", "user")

    if not name or not email or not password or not phone or not address:
        return jsonify({"Message": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"Message": "User with that email already exists"}), 400

    try:
        new_user = User(
            name=name,
            email=email,
            phone=phone,
            address=address,
            role=role
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()  # Ensure database integrity
        return jsonify({"message": "Database error", "error": str(e)}), 500

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Logs in an existing user and returns an access token."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    # Include user role and name
    additional_claims = {"role": user.role, "name": user.name}

    # Access token with the additional claims
    access_token = create_access_token(
        identity=str(user.user_id),
        additional_claims=additional_claims
    )
    return jsonify({"access_token": access_token}), 200
