# routes/admin.py
from flask import Blueprint, request, jsonify
from Deligo_packages.models import Restaurant, Order, OrderItem, Dish, db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, get_jwt_identity
from Deligo_packages.decorators import role_required
from Deligo_packages.models import User


admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# Create a new restaurant (admin only)
@admin_bp.route('/restaurants', methods=['POST'])
@jwt_required()
@role_required(["admin"])
def create_restaurant():
    data = request.get_json()
    try:
        restaurant = Restaurant(
            name=data['name'],
            description=data['description'],
            address=data['address'],
            phone=data['phone'],
            rating=0.0
        )
        db.session.add(restaurant)
        db.session.commit()
        return jsonify(restaurant.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    

@admin_bp.route('/restaurants', methods=['GET'])
@jwt_required()
@role_required(["admin"])
def get_restaurants():
    try:
        restaurants = Restaurant.query.all()
        return jsonify([r.to_dict() for r in restaurants]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500

# Update a restaurant (admin only)
@admin_bp.route('/restaurants/<int:restaurant_id>', methods=['PUT'])
@jwt_required()
@role_required(["admin"])
def update_restaurant(restaurant_id):
    data = request.get_json()
    try:
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"error": "Restaurant not found"}), 404
        restaurant.name = data.get('name', restaurant.name)
        restaurant.description = data.get('description', restaurant.description)
        restaurant.address = data.get('address', restaurant.address)
        restaurant.phone = data.get('phone', restaurant.phone)
        db.session.commit()
        return jsonify(restaurant.to_dict()), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

# Delete a restaurant (admin only)
@admin_bp.route('/restaurants/<int:restaurant_id>', methods=['DELETE'])
@jwt_required()
@role_required(["admin"])
def delete_restaurant(restaurant_id):
    try:
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"error": "Restaurant not found"}), 404

        # Deelete associated dishes first
        Dish.query.filter_by(restaurant_id=restaurant_id).delete()

        db.session.delete(restaurant)
        db.session.commit()
        return jsonify({"message": "Restaurant deleted"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500

# Get all users (admin only)
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@role_required(["admin"])
def get_admin_users():
    try:
        admin_users = User.query.filter_by(role="admin").all()
        return jsonify([user.to_dict() for user in admin_users]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500

# Get all orders (admin only)
@admin_bp.route('/orders', methods=['GET'])
@jwt_required()
@role_required(["admin"])
def get_all_orders():
    try:
        orders = Order.query.all()
        return jsonify([order.to_dict() for order in orders]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500
    
# Get all orders for a specific restaurant (admin only)
@admin_bp.route('/restaurants/<int:restaurant_id>/orders', methods=['GET'])
@jwt_required()
@role_required(["admin"])
def get_orders_for_restaurant(restaurant_id):
    try:
        orders = Order.query.filter_by(restaurant_id=restaurant_id).all()
        return jsonify([order.to_dict() for order in orders]), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500
    
# Get analytics Data (admin only)
@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
@role_required(["admin"])
def get_analytics_data():
    try:
        total_orders = Order.query.count()
        total_revenue = db.session.query(db.func.sum(Order.total_amount)).scalar()
        return jsonify({"total_orders": total_orders, "total_revenue": total_revenue}), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500     
