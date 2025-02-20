from datetime import datetime
from Deligo_packages.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    orders = db.relationship('Order', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f'<User {self.name}>'


class Restaurant(db.Model):
    __tablename__ = 'restaurants'
    restaurant_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    #logo_url = db.Column(db.String(255))
    rating = db.Column(db.Numeric(3, 2), default=0.0)
    dishes = db.relationship('Dish', backref='restaurant', lazy=True)

    def to_dict(self):
        return {
            "restaurant_id": self.restaurant_id,
            "name": self.name,
            "description": self.description,
            "address": self.address,
            "phone": self.phone,
            #"logo_url": self.logo_url,
            "rating": float(self.rating),
            "dishes": [dish.to_dict() for dish in self.dishes] if self.dishes else [],
        }

    def __repr__(self):
        return f'<Restaurant {self.name}>'


class Dish(db.Model):
    __tablename__ = 'dishes'
    dish_id = db.Column(db.Integer, primary_key=True)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    #image_url = db.Column(db.String(255))
    is_available = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            "dish_id": self.dish_id,
            "restaurant_id": self.restaurant_id,
            "name": self.name,
            "description": self.description,
            "price": float(self.price),
            #"image_url": self.image_url,
            "is_available": self.is_available,
        }

    def __repr__(self):
        return f'<Dish {self.name} - {self.restaurant.name if self.restaurant else "N/A"}>'


class Order(db.Model):
    __tablename__ = 'orders'
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    delivery_address = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    items = db.relationship('OrderItem', backref='order', lazy=True)

    def to_dict(self):
        return {
            "order_id": self.order_id,
            "user_id": self.user_id,
            "restaurant_id": self.restaurant_id,
            "total_amount": float(self.total_amount),
            "delivery_address": self.delivery_address,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "items": [item.to_dict() for item in self.items] if self.items else [],
        }

    def __repr__(self):
        return f'<Order {self.order_id} for User {self.user_id}>'


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    order_item_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.dish_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_order = db.Column(db.Numeric(10, 2), nullable=False)

    def to_dict(self):
        return {
            "order_item_id": self.order_item_id,
            "order_id": self.order_id,
            "dish_id": self.dish_id,
            "quantity": self.quantity,
            "price_at_order": float(self.price_at_order),
        }

    def __repr__(self):
        return f'<OrderItem {self.order_item_id} - Dish {self.dish_id} x{self.quantity}>'
