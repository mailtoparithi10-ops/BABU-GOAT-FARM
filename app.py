import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config
from database import db, init_db
from routes import register_routes

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # Create tables and initial admin
    with app.app_context():
        init_db()
    
    # Register API routes FIRST (before catch-all)
    register_routes(app)
    
    @app.route('/api')
    def api_index():
        return jsonify({
            "message": "Babu Goat Farm API is running",
            "version": "1.0.0"
        })
    
    @app.route('/api/health')
    def health():
        return jsonify({"status": "healthy"})
    
    @app.route('/api/debug/users')
    def debug_users():
        from models import User
        users = User.query.all()
        return jsonify({
            "total_users": len(users),
            "users": [{
                "id": u.id,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active
            } for u in users]
        })
    
    # Serve index.html for root
    @app.route('/')
    def serve_index():
        return send_from_directory(app.static_folder, 'index.html')
    
    # Catch-all route for frontend (but not for /api or /static)
    @app.route('/<path:path>')
    def serve_frontend(path):
        # Don't intercept API or static routes
        if path.startswith('api/') or path.startswith('static/'):
            return jsonify({"error": "Not found"}), 404
        
        # For all other routes, serve index.html
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
