from flask import Flask
from flask_cors import CORS
from Deligo_packages.config import Config
from Deligo_packages.extensions import db, socketio, jwt
from flask_socketio import join_room


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    
    # Enable CORS
    CORS(app, origins="http://localhost:3000", supports_credentials=True)
         
    # Register Blueprints
    from Deligo_packages.routes.auth import auth_bp
    from Deligo_packages.routes.restaurants import restaurant_bp
    from Deligo_packages.routes.orders import order_bp
    
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(restaurant_bp, url_prefix="/api/restaurants")
    app.register_blueprint(order_bp, url_prefix="/api/orders")
    
    with app.app_context():
        db.create_all()
    
    return app

# Socket.IO event to join an order room (for real-time tracking)
@socketio.on('joinOrderRoom')
def on_join_order_room(data):
    order_id = data.get("order_id")
    if order_id:
        join_room(str(order_id))
        socketio.emit("message", f"Joined room {order_id}")


if __name__ == '__main__':
    app = create_app()
    socketio.run(app, port=5000, debug=True)
