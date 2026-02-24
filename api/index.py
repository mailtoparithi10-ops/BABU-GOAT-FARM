import sys
import os

# Make the goat-farm-backend importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'goat-farm-backend'))

from app.main import app as fastapi_app


class StripApiPrefixMiddleware:
    """
    Strips the /api prefix from request paths before FastAPI handles them.
    Vercel sends /api/goats → this strips to /goats → FastAPI routes correctly.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] in ('http', 'websocket'):
            path = scope.get('path', '/')
            if path.startswith('/api'):
                stripped = path[4:] or '/'
                scope = dict(scope)
                scope['path'] = stripped
                scope['raw_path'] = stripped.encode()
        await self.app(scope, receive, send)


# Wrap the FastAPI app with path-stripping middleware
app = StripApiPrefixMiddleware(fastapi_app)
