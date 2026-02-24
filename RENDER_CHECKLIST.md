# Render Deployment Checklist

## Pre-Deployment Preparation ✅

### 1. GitHub Repository Setup

- [ ] Push all code to GitHub
- [ ] Ensure `.gitignore` excludes `.env` and `venv/`
- [ ] Verify all files are committed

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Generate Production Secrets

**SECRET_KEY** - Run this in Python:
```python
import secrets
print(secrets.token_urlsafe(32))
```
Copy the output for use in Render.

**ADMIN_PASSWORD** - Choose a strong password (not admin123!)

---

## Render Deployment Steps

### STEP 1: Create PostgreSQL Database (5 minutes)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `goat-farm-db`
   - **Database:** `goatfarm`
   - **User:** (auto-generated)
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** 16 (latest)
   - **Plan:** Free (or Starter $7/month for production)

4. Click **"Create Database"**
5. Wait for database to provision (2-3 minutes)
6. **IMPORTANT:** Copy the **"Internal Database URL"**
   - Format: `postgresql://user:password@host/database`
   - You'll need this in Step 2

---

### STEP 2: Deploy Backend Web Service (10 minutes)

1. In Render Dashboard, click **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Click "Connect account" if needed
   - Select your GitHub repository
   - Click "Connect"

3. **Configure Service:**
   - **Name:** `goat-farm-backend`
   - **Region:** Same as database
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements-prod.txt`
   - **Start Command:** `gunicorn app:create_app()`
   - **Plan:** Free (or Starter $7/month)

4. **Add Environment Variables:**

   Click "Advanced" → "Add Environment Variable" for each:

   ```
   DATABASE_URL
   Value: [Paste Internal Database URL from Step 1]
   
   SECRET_KEY
   Value: [Paste generated secret from preparation]
   
   ALGORITHM
   Value: HS256
   
   ACCESS_TOKEN_EXPIRE_MINUTES
   Value: 60
   
   FIRST_ADMIN_NAME
   Value: Admin
   
   FIRST_ADMIN_EMAIL
   Value: admin@goatfarm.com
   
   FIRST_ADMIN_PASSWORD
   Value: [Your secure password - NOT admin123]
   
   CORS_ORIGINS
   Value: *
   ```

5. Click **"Create Web Service"**

6. Wait for deployment (5-10 minutes)
   - Watch the logs for any errors
   - Look for "✅ Initial admin created"
   - Service should show "Live" status

7. **Test Backend:**
   - Copy your backend URL (e.g., `https://goat-farm-backend.onrender.com`)
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"healthy"}`

---

### STEP 3: Deploy Frontend Static Site (10 minutes)

1. In Render Dashboard, click **"New +"** → **"Static Site"**

2. **Connect Repository:**
   - Select same GitHub repository
   - Click "Connect"

3. **Configure Static Site:**
   - **Name:** `goat-farm-frontend`
   - **Branch:** `main`
   - **Root Directory:** `goat-farm-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Add Environment Variable:**
   
   Click "Advanced" → "Add Environment Variable":
   
   ```
   VITE_API_URL
   Value: https://your-backend-url.onrender.com
   ```
   
   Replace with your actual backend URL from Step 2.

5. Click **"Create Static Site"**

6. Wait for deployment (3-5 minutes)

7. **Get Frontend URL:**
   - Copy your frontend URL (e.g., `https://goat-farm-frontend.onrender.com`)

---

### STEP 4: Update CORS Settings

1. Go back to your **Backend Web Service**
2. Click **"Environment"** in left sidebar
3. Find **CORS_ORIGINS** variable
4. Click "Edit"
5. Update value to your frontend URL:
   ```
   https://your-frontend-url.onrender.com
   ```
6. Click "Save Changes"
7. Backend will automatically redeploy (1-2 minutes)

---

### STEP 5: Test Your Deployment ✅

1. **Visit Frontend:**
   - Open: `https://your-frontend-url.onrender.com`

2. **Login:**
   - Email: `admin@goatfarm.com`
   - Password: [Your secure password from Step 2]

3. **Test Features:**
   - [ ] Dashboard loads
   - [ ] Can view goats page
   - [ ] Can view inventory page
   - [ ] Can view expenses page
   - [ ] Can view sales page

4. **Check Backend Logs:**
   - Go to Backend service → "Logs"
   - Verify no errors

---

## Post-Deployment Configuration

### Custom Domain (Optional)

**Backend:**
1. Go to Backend service → "Settings"
2. Scroll to "Custom Domain"
3. Add: `api.yourdomain.com`
4. Follow DNS instructions

**Frontend:**
1. Go to Frontend site → "Settings"
2. Scroll to "Custom Domain"
3. Add: `yourdomain.com`
4. Follow DNS instructions

### Update Environment Variables

After adding custom domains, update:
- Backend `CORS_ORIGINS` → `https://yourdomain.com`
- Frontend `VITE_API_URL` → `https://api.yourdomain.com`

---

## Important Notes

### Free Tier Limitations

**Backend (Web Service):**
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ✅ 750 hours/month free (enough for 1 service)

**Database (PostgreSQL):**
- ✅ 1GB storage
- ✅ 90 days data retention
- ⚠️ Expires after 90 days on free plan

**Frontend (Static Site):**
- ✅ 100GB bandwidth/month
- ✅ Always on (no spin-down)
- ✅ Global CDN

### Upgrade to Paid Plan

For production use, consider:
- **Backend:** Starter plan ($7/month) - No spin-down
- **Database:** Starter plan ($7/month) - No expiration
- **Total:** $14/month for reliable production service

---

## Troubleshooting

### Backend won't start

**Check logs for:**
- Missing environment variables
- Database connection errors
- Python dependency issues

**Solutions:**
- Verify all environment variables are set
- Check DATABASE_URL is correct (Internal URL)
- Ensure requirements-prod.txt includes all dependencies

### Database connection failed

**Check:**
- DATABASE_URL uses Internal Database URL (not External)
- Database is in same region as backend
- Database status is "Available"

**Solution:**
- Copy Internal Database URL from database dashboard
- Update DATABASE_URL in backend environment variables

### Frontend can't connect to backend

**Check:**
- VITE_API_URL is set correctly
- Backend CORS_ORIGINS includes frontend URL
- Backend is "Live" and responding

**Solution:**
- Verify VITE_API_URL in frontend environment
- Update CORS_ORIGINS in backend
- Test backend health endpoint directly

### 502 Bad Gateway

**Causes:**
- Backend is spinning up (wait 30-60 seconds)
- Backend crashed (check logs)
- Build failed (check build logs)

**Solution:**
- Wait for backend to spin up
- Check logs for errors
- Trigger manual deploy if needed

---

## Monitoring & Maintenance

### Check Service Health

**Backend:**
- Visit: `https://your-backend.onrender.com/health`
- Should return: `{"status":"healthy"}`

**Frontend:**
- Visit: `https://your-frontend.onrender.com`
- Should load login page

### View Logs

**Backend:**
- Dashboard → Backend Service → "Logs"
- Monitor for errors and warnings

**Database:**
- Dashboard → PostgreSQL → "Metrics"
- Monitor connections and storage

### Backup Database

**Manual Backup:**
1. Go to PostgreSQL service
2. Click "Backups" tab
3. Click "Create Backup"

**Automated Backups:**
- Available on paid plans
- Daily automatic backups

---

## Security Checklist

- [ ] Changed default admin password
- [ ] Generated strong SECRET_KEY
- [ ] Set specific CORS_ORIGINS (not *)
- [ ] Using HTTPS (automatic on Render)
- [ ] Environment variables are secret
- [ ] Database uses Internal URL
- [ ] No sensitive data in git repository

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Community:** https://community.render.com
- **Support:** support@render.com

---

## Quick Reference

### Your URLs (fill in after deployment)

```
Backend:  https://______________________.onrender.com
Frontend: https://______________________.onrender.com
Database: [Internal URL - keep secret]
```

### Admin Credentials

```
Email:    admin@goatfarm.com
Password: [Your secure password]
```

### Important Commands

**Trigger Manual Deploy:**
- Dashboard → Service → "Manual Deploy" → "Deploy latest commit"

**View Logs:**
- Dashboard → Service → "Logs"

**Restart Service:**
- Dashboard → Service → "Manual Deploy" → "Clear build cache & deploy"

---

## Deployment Complete! 🎉

Once all steps are complete:
1. ✅ Backend is live and healthy
2. ✅ Frontend is accessible
3. ✅ Database is connected
4. ✅ CORS is configured
5. ✅ Admin can login
6. ✅ All features working

Your Goat Farm Management System is now live on Render!
