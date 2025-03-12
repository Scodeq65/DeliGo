from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def role_required(required_roles):
    """
    Custom decorator to check if the user has one of the required roles.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            user_role = claims.get("role", "user")
            if user_role not in required_roles:
                return jsonify({"message": "Access forbidden: insufficient privileges"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
