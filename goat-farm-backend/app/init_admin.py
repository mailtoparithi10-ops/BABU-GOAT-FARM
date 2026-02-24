from sqlalchemy.orm import Session
from .config import settings
from .models import User
from .auth import hash_password

def create_initial_admin(db: Session):
    admin = db.query(User).filter(User.email == settings.FIRST_ADMIN_EMAIL).first()
    if not admin:
        new_admin = User(
            name=settings.FIRST_ADMIN_NAME,
            email=settings.FIRST_ADMIN_EMAIL,
            password_hash=hash_password(settings.FIRST_ADMIN_PASSWORD),
            role="admin",
            is_active=True
        )
        db.add(new_admin)
        db.commit()
