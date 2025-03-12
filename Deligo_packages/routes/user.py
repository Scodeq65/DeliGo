# routes/user.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Deligo_packages.models import User
from Deligo_packages.extensions import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    return jsonify({"message": "User not found"}), 404

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Update allowed fields
    user.name = data.get('name', user.name)
    user.phone = data.get('phone', user.phone)
    user.address = data.get('address', user.address)
    db.session.commit()
    return jsonify(user.to_dict()), 200
