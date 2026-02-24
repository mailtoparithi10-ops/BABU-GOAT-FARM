import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config
from database import db, init_db
from routes import register_routes

def create_app():
    app = Flask(__name__, static_folder='goat-farm-frontend/dist', static_url_path='')
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
    
    # Serve React frontend - catch-all route LAST (but not for /api routes)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        static_folder = app.static_folder
        
        # Check if static folder exists
        if not static_folder or not os.path.exists(static_folder):
            return jsonify({
                "error": "Frontend not built",
                "static_folder": static_folder
            }), 404
        
        # If it's a file with extension (like .js, .css, .png), try to serve it
        if path and '.' in os.path.basename(path):
            file_path = os.path.join(static_folder, path)
            if os.path.exists(file_path):
                return send_from_directory(static_folder, path)
            return jsonify({"error": "File not found"}), 404
        
        # For all other routes (including /, /dashboard, /goats, etc.), serve index.html
        # This allows React Router to handle the routing
        index_path = os.path.join(static_folder, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder, 'index.html')
        
        return jsonify({"error": "index.html not found"}), 404
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
