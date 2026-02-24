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
    
    # Register API routes
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
    
    # Serve React frontend
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
