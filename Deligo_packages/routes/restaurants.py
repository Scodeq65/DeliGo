from flask import Blueprint, jsonify, request
from Deligo_packages.extensions import db
from Deligo_packages.models import Restaurant, Dish
from sqlalchemy.exc import SQLAlchemyError

restaurant_bp = Blueprint('restaurants', __name__, url_prefix='/api/restaurants')


def get_pagination_metadata(paginated_query):
    """
    Helper function to generate pagination metadata.
    """
    return {
        'page': paginated_query.page,
        'per_page': paginated_query.per_page,
        'total_pages': paginated_query.pages,
        'total_items': paginated_query.total
    }


@restaurant_bp.route('/', methods=['GET'])
def get_restaurants():
    """
    Retrieve a paginated list of active restaurants.
    """
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        restaurants = Restaurant.query.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'data': [restaurant.to_dict() for restaurant in restaurants.items],
            'pagination': get_pagination_metadata(restaurants)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@restaurant_bp.route('/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):
    """
    Retrieve details of a specific active restaurant by ID.
    """
    try:
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"error": "Restaurant not found"}), 404
        return jsonify(restaurant.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@restaurant_bp.route('/<int:restaurant_id>/menu', methods=['GET'])
def get_menu(restaurant_id):
    """
    Retrieve a paginated list of available dishes for a specific active restaurant.
    """
    try:
        # Ensure restaurant exists and is active
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"error": "Restaurant not found"}), 404
        
        # Get paginated list of available and active dishes
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        dishes = Dish.query.filter_by(
            restaurant_id=restaurant_id,
            is_available=True,
        ).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'restaurant_id': restaurant_id,
            'data': [dish.to_dict() for dish in dishes.items],
            'pagination': get_pagination_metadata(dishes)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@restaurant_bp.route('/', methods=['POST'])
def create_restaurant():
    """
    Create a new restaurant with the required fields: name, address, and phone.
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'address', 'phone']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        # Create and save the new restaurant
        restaurant = Restaurant(
            name=data['name'],
            address=data['address'],
            phone=data['phone'],
            description=data.get('description', ''),
            #logo_url=data.get('logo_url', '')
        )
        
        db.session.add(restaurant)
        db.session.commit()
        
        return jsonify(restaurant.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@restaurant_bp.route('/<int:restaurant_id>/menu', methods=['POST'])
def add_dish(restaurant_id):
    """
    Add a new dish to a restaurant's menu.
    """
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'price', 'description', 'is_available']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Check if the restaurant exists and is active
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return jsonify({"error": "Restaurant not found"}), 404

        # Create and save the new dish
        dish = Dish(
            name=data['name'],
            price=data['price'],
            description=data['description'],
            is_available=data['is_available'],
            restaurant_id=restaurant_id
        )

        db.session.add(dish)
        db.session.commit()

        return jsonify(dish.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400
