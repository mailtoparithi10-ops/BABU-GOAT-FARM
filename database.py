from flask_sqlalchemy import SQLAlchemy
from auth import hash_password

db = SQLAlchemy()

def init_db():
    """Create tables and initial admin user"""
    from models import User
    from config import Config
    
    db.create_all()
    
    # Create initial admin if not exists
    admin = User.query.filter_by(email=Config.FIRST_ADMIN_EMAIL).first()
    if not admin:
        admin = User(
            name=Config.FIRST_ADMIN_NAME,
            email=Config.FIRST_ADMIN_EMAIL,
            password_hash=hash_password(Config.FIRST_ADMIN_PASSWORD),
            role='admin',
            is_active=True
        )
        db.session.add(admin)
        db.session.commit()
        print(f"✅ Initial admin created: {Config.FIRST_ADMIN_EMAIL}")
