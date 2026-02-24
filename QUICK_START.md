# Quick Start Guide

## First Time Setup (Windows)

1. **Run setup script:**
   ```
   setup.bat
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update database URL and credentials
   - Set admin email and password

3. **Start development servers:**
   ```
   start_dev.bat
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Manual Setup

### Backend
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env with your settings

# Run server
python app.py
```

### Frontend
```bash
cd goat-farm-frontend
npm install
npm run dev
```

## Deploy to Render

1. **Create account:** https://render.com
2. **Create PostgreSQL database**
3. **Deploy backend:**
   - New Web Service
   - Connect GitHub repo
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn app:create_app()`
   - Add environment variables

4. **Deploy frontend:**
   - New Static Site
   - Root: `goat-farm-frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed instructions.

## Default Login

After first run:
- Email: From `FIRST_ADMIN_EMAIL` in .env
- Password: From `FIRST_ADMIN_PASSWORD` in .env

## Testing API

```bash
python test_api.py
```

## Common Commands

### Backend
```bash
# Run development server
python app.py

# Test API
python test_api.py
```

### Frontend
```bash
cd goat-farm-frontend

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Port already in use
- Backend: Change port in app.py
- Frontend: Vite will auto-select next available port

### Database connection error
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials

### CORS errors
- Update CORS_ORIGINS in .env
- Include frontend URL

### Module not found
- Activate virtual environment
- Run: `pip install -r requirements.txt`

## Project Structure

```
Root/
├── app.py              # Flask app
├── routes.py           # API endpoints
├── models.py           # Database models
├── auth.py             # Authentication
├── config.py           # Configuration
├── database.py         # DB initialization
└── goat-farm-frontend/ # React app
```

## Need Help?

- Check [README.md](README.md) for full documentation
- See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for deployment
- Open an issue on GitHub
