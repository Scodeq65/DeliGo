from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
socketio = SocketIO()
jwt = JWTManager()
