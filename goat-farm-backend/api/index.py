import sys
import os

# Add the backend root to path so 'app' module can be found
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.main import app
