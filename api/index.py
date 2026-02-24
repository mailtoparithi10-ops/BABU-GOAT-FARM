import sys
import os

# Make the goat-farm-backend importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'goat-farm-backend'))

from app.main import app
