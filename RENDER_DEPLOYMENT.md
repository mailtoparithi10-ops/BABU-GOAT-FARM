# Render Deployment Guide - Goat Farm Management System

## Project Structure (Flask)

```
goat-farm-management/
├── app.py                 # Main Flask application
├── config.py              # Configuration settings
├── database.py            # Database initialization
├── models.py              # SQLAlchemy models
├── auth.py                # Authentication & authorization
├── routes.py              # API routes/endpoints
├── requirements.txt       # Python dependencies
├── render.yaml            # Render configuration
├── .env.example           # Environment variables template
└── goat-farm-frontend/    # React frontend (separate deployment)
```

## Step 1: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `goat-farm-db`
   - Database: `goatfarm`
   - User: (auto-generated)
   - Region: Choose closest to you
   - Plan: Free (or paid for production)
4. Click "Create Database"
5. Copy the "Internal Database URL" (starts with `postgresql://`)

## Step 2: Deploy Backend Web Service

### Option A: Using Render Dashboard (Recommended)

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `goat-farm-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:create_app()`
   - Plan: Free (or paid)

5. Add Environment Variables:
   ```
   DATABASE_URL = [paste Internal Database URL from Step 1]
   SECRET_KEY = [generate using: python -c "import secrets; print(secrets.token_urlsafe(32))"]
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 60
   FIRST_ADMIN_NAME = Admin
   FIRST_ADMIN_EMAIL = admin@example.com
   FIRST_ADMIN_PASSWORD = [your secure password]
   CORS_ORIGINS = *
   ```

6. Click "Create Web Service"

### Option B: Using render.yaml (Infrastructure as Code)

1. Push `render.yaml` to your repository
2. In Render Dashboard, click "New +" → "Blueprint"
3. Connect your repository
4. Render will auto-detect `render.yaml`
5. Manually set these environment variables:
   - `DATABASE_URL` (from your PostgreSQL database)
   - `FIRST_ADMIN_PASSWORD` (your secure password)

## Step 3: Deploy Frontend (Static Site)

1. Click "New +" → "Static Site"
2. Connect your repository
3. Configure:
   - Name: `goat-farm-frontend`
   - Root Directory: `goat-farm-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. Add Environment Variable:
   ```
   VITE_API_URL = https://goat-farm-backend.onrender.com
   ```

5. Update frontend API configuration to use `VITE_API_URL`

## Step 4: Update CORS Settings

After frontend is deployed, update backend environment variable:

```
CORS_ORIGINS = https://your-frontend.onrender.com
```

## API Endpoints

Base URL: `https://goat-farm-backend.onrender.com`

### Authentication
- POST `/auth/login` - Login
- POST `/auth/register` - Register new user (admin only)

### Goats
- GET `/goats` - List all goats
- POST `/goats` - Create goat
- PUT `/goats/<id>` - Update goat
- DELETE `/goats/<id>` - Delete goat

### Inventory
- GET `/inventory` - List inventory
- POST `/inventory` - Add item
- PUT `/inventory/<id>` - Update item
- DELETE `/inventory/<id>` - Delete item

### Expenses
- GET `/expenses` - List expenses
- POST `/expenses` - Add expense
- PUT `/expenses/<id>` - Update expense
- DELETE `/expenses/<id>` - Delete expense

### Sales
- GET `/sales` - List sales
- POST `/sales` - Record sale
- DELETE `/sales/<id>` - Delete sale

### Dashboard
- GET `/dashboard/summary` - Get dashboard statistics

## Testing Locally

1. Create `.env` file (copy from `.env.example`)
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the app:
   ```bash
   python app.py
   ```

4. Test endpoints:
   ```bash
   curl http://localhost:5000/
   curl http://localhost:5000/health
   ```

## Common Issues

### Issue: "Application failed to start"
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct

### Issue: Database connection errors
- Verify `DATABASE_URL` uses Internal Database URL
- Check database is running in Render dashboard
- Ensure database allows connections

### Issue: CORS errors
- Update `CORS_ORIGINS` with your frontend URL
- Use comma-separated list for multiple origins
- No trailing slashes in URLs

### Issue: 502 Bad Gateway
- Check if app is listening on correct port (Render sets PORT env var)
- Verify gunicorn command is correct
- Check application logs

## Monitoring

- View logs: Render Dashboard → Your Service → Logs
- Check health: `https://your-app.onrender.com/health`
- Monitor database: Render Dashboard → PostgreSQL → Metrics

## Free Tier Limitations

- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for 1 service)
- Database: 90 days retention, 1GB storage

## Upgrade to Paid Plan

For production use, consider:
- Paid plan ($7/month) - No spin-down
- Larger database plan
- Custom domain
- Better performance

## Security Checklist

- ✅ Use strong SECRET_KEY
- ✅ Use strong FIRST_ADMIN_PASSWORD
- ✅ Set specific CORS_ORIGINS (not *)
- ✅ Use HTTPS (automatic on Render)
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets
