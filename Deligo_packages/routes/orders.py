from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from Deligo_packages.models import Order, OrderItem, Dish, db
from Deligo_packages.extensions import socketio
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')


@order_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()

    # Validate required fields
    required_fields = ['items', 'delivery_address']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        total = 0
        items = []
        restaurant_id = None

        # Validate items and calculate total
        for item in data['items']:
            if 'dish_id' not in item or 'quantity' not in item:
                return jsonify({"error": "Invalid item format"}), 400

            dish = Dish.query.get(item['dish_id'])
            if not dish:
                return jsonify({"error": f"Dish {item['dish_id']} not found"}), 404
            if not dish.is_available:
                return jsonify({"error": f"Dish {item['dish_id']} not available"}), 400
            if restaurant_id and dish.restaurant_id != restaurant_id:
                return jsonify({"error": "All items must be from the same restaurant"}), 400

            restaurant_id = dish.restaurant_id
            item_total = dish.price * item['quantity']
            total += item_total
            items.append({
                'dish': dish,
                'quantity': item['quantity'],
                'price': dish.price,
                'total': item_total
            })

        # Create order
        order = Order(
            user_id=user_id,
            restaurant_id=restaurant_id,
            total_amount=total,
            delivery_address=data['delivery_address'],
            status='pending'
        )
        db.session.add(order)
        db.session.commit()

        # Add order items
        for item in items:
            order_item = OrderItem(
                order_id=order.order_id,
                dish_id=item['dish'].dish_id,
                quantity=item['quantity'],
                price_at_order=item['price']
            )
            db.session.add(order_item)

        db.session.commit()

        # Emit real-time update
        socketio.emit('order_update', {
            'order_id': order.order_id,
            'user_id': user_id,
            'restaurant_id': restaurant_id,
            'status': 'pending',
            'timestamp': datetime.utcnow().isoformat()
        })

        return jsonify({
            'message': 'Order created successfully',
            'order_id': order.order_id,
            'total_amount': float(total),
            'status': 'pending'
        }), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@order_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    valid_statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']
    new_status = data.get('status')

    if not new_status or new_status not in valid_statuses:
        return jsonify({"error": "Invalid status"}), 400

    try:
        order = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order.status = new_status
        db.session.commit()

        # Emit real-time update
        socketio.emit('order_update', {
            'order_id': order.order_id,
            'user_id': user_id,
            'status': new_status,
            'timestamp': datetime.utcnow().isoformat()
        })

        return jsonify(order.to_dict()), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@order_bp.route('/my-orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()

    try:
        # Add pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        orders = Order.query.filter_by(user_id=user_id) \
            .order_by(Order.created_at.desc()) \
            .paginate(page=page, per_page=per_page)

        return jsonify({
            'data': [order.to_dict() for order in orders.items],
            'pagination': {
                'page': orders.page,
                'per_page': orders.per_page,
                'total_pages': orders.pages,
                'total_items': orders.total
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
