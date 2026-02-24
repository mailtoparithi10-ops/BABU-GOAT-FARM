# Babu Goat Farm Management System

A complete farm management system for meat goat farming operations, built with Flask (backend) and React (frontend).

## Features

- 🐐 Goat Management (tracking, breeding, health records)
- 📦 Inventory Management (feed, medicine, equipment)
- 💰 Financial Tracking (expenses, sales, profit analysis)
- 📊 Dashboard with real-time statistics
- 👥 User Management (admin and worker roles)
- 🔐 Secure authentication with JWT

## Tech Stack

### Backend (Flask)
- Flask 3.0
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- JWT Authentication
- Flask-CORS

### Frontend (React)
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

## Project Structure

```
goat-farm-management/
├── app.py                      # Flask application entry point
├── config.py                   # Configuration
├── database.py                 # Database setup
├── models.py                   # Database models
├── auth.py                     # Authentication logic
├── routes.py                   # API endpoints
├── requirements.txt            # Python dependencies
├── render.yaml                 # Render deployment config
├── .env.example                # Environment variables template
├── test_api.py                 # API testing script
└── goat-farm-frontend/         # React frontend
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── pages/              # Page components
    │   ├── services/           # API services
    │   └── context/            # React context
    └── package.json
```

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL (for production) or SQLite (for local dev)

### Backend Setup

1. Clone the repository
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your settings:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/goatfarm
   SECRET_KEY=your-secret-key
   FIRST_ADMIN_EMAIL=admin@example.com
   FIRST_ADMIN_PASSWORD=admin123
   ```

6. Run the application:
   ```bash
   python app.py
   ```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd goat-farm-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - Register new user (admin only)

### Goats
- `GET /goats` - List all goats
- `POST /goats` - Create new goat
- `PUT /goats/<id>` - Update goat
- `DELETE /goats/<id>` - Delete goat

### Inventory
- `GET /inventory` - List inventory items
- `POST /inventory` - Add inventory item
- `PUT /inventory/<id>` - Update item
- `DELETE /inventory/<id>` - Delete item

### Expenses
- `GET /expenses` - List expenses
- `POST /expenses` - Add expense
- `PUT /expenses/<id>` - Update expense
- `DELETE /expenses/<id>` - Delete expense

### Sales
- `GET /sales` - List sales
- `POST /sales` - Record sale
- `DELETE /sales/<id>` - Delete sale

### Dashboard
- `GET /dashboard/summary` - Get statistics

## Deployment

### Deploy to Render

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed instructions.

Quick steps:
1. Create PostgreSQL database on Render
2. Deploy backend as Web Service
3. Deploy frontend as Static Site
4. Configure environment variables

## Testing

Test the API locally:
```bash
python test_api.py
```

## Default Admin Credentials

After first run, login with:
- Email: Set in `FIRST_ADMIN_EMAIL` env var
- Password: Set in `FIRST_ADMIN_PASSWORD` env var

**⚠️ Change these in production!**

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration (default: 60)
- `FIRST_ADMIN_NAME` - Initial admin name
- `FIRST_ADMIN_EMAIL` - Initial admin email
- `FIRST_ADMIN_PASSWORD` - Initial admin password
- `CORS_ORIGINS` - Allowed origins (comma-separated)

### Frontend
- `VITE_API_URL` - Backend API URL

## Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Role-based access control (admin/worker)
- Environment-based configuration

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
