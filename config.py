import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database - Use SQLite for free tier deployment
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        # Default to SQLite if no DATABASE_URL is provided
        database_url = 'sqlite:///goatfarm.db'
    elif database_url.startswith('postgres://'):
        # Fix postgres:// to postgresql:// (Render uses postgres://)
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security - Use defaults if not provided
    SECRET_KEY = os.getenv('SECRET_KEY', 'vfp_nC0m9ymsnMK4KWLBiaamqDIxQnDQuRuWob_8-b8')
    JWT_ALGORITHM = os.getenv('ALGORITHM', 'HS256')
    JWT_EXPIRATION_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 60))
    
    # Admin - Use defaults if not provided
    FIRST_ADMIN_NAME = os.getenv('FIRST_ADMIN_NAME', 'Admin')
    FIRST_ADMIN_EMAIL = os.getenv('FIRST_ADMIN_EMAIL', 'admin@goatfarm.com')
    FIRST_ADMIN_PASSWORD = os.getenv('FIRST_ADMIN_PASSWORD', 'Admin@123')
    
    # CORS
    cors_origins = os.getenv('CORS_ORIGINS', '*')
    CORS_ORIGINS = cors_origins.split(',') if cors_origins != '*' else ['*']
