# Render + Vercel Deployment Guide

## 🎯 Step-by-Step Deployment Instructions

### Prerequisites
- [ ] GitHub account
- [ ] Render account (free) - [render.com](https://render.com)
- [ ] Vercel account (free) - [vercel.com](https://vercel.com)
- [ ] Code pushed to GitHub

---

## 📦 Step 1: Deploy PostgreSQL Database on Render

1. **Login to Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New PostgreSQL Database**
   - Click "New +" button → Select "PostgreSQL"
   
3. **Configure Database**
   - **Name**: `pg-management-db`
   - **Database**: `pg_management`
   - **User**: (auto-generated)
   - **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
   - **PostgreSQL Version**: 15 or higher
   - **Plan**: **Free**

4. **Create Database**
   - Click "Create Database"
   - Wait for provisioning (2-3 minutes)

5. **Save Database Credentials**
   - Go to database dashboard
   - Copy **Internal Database URL** (looks like):
     ```
     postgresql://pg_management_user:xxxxx@dpg-xxxxx.oregon-postgres.render.com/pg_management
     ```
   - **Important**: Save this URL - you'll need it for the backend!

---

## 🚀 Step 2: Deploy Backend on Render

1. **Push Code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create New Web Service**
   - On Render dashboard, click "New +" → "Web Service"
   - Click "Connect a repository"
   - Select your `hotel-pg-management-system` repository

3. **Configure Web Service**
   - **Name**: `pg-management-backend`
   - **Region**: Same as database (e.g., Oregon)
   - **Branch**: `main`
   - **Root Directory**: Leave empty (use repository root)
   - **Runtime**: Will auto-detect (no need to select)
   - **Build Command**: 
     ```bash
     cd backend && mvn clean package -DskipTests
     ```
   - **Start Command**: 
     ```bash
     java -jar backend/target/pg-management-backend-1.0.0.jar
     ```
   - **Plan**: **Free**

4. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable")
   
   Add these variables one by one:
   
   | Key | Value |
   |-----|-------|
   | `SPRING_DATASOURCE_URL` | Convert Internal Database URL to JDBC format:<br>`jdbc:postgresql://dpg-xxxxx.oregon-postgres.render.com/pg_management` |
   | `SPRING_DATASOURCE_USERNAME` | (from Render DB dashboard) |
   | `SPRING_DATASOURCE_PASSWORD` | (from Render DB dashboard) |
   | `JWT_SECRET` | Generate a secure random string (at least 32 characters):<br>You can use: `openssl rand -base64 32` |
   | `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` (update after deploying frontend) |
   | `LOG_LEVEL` | `INFO` |
   | `SPRING_JPA_SHOW_SQL` | `false` |

5. **Create Web Service**
   - Click "Create Web Service"
   - **Wait 5-10 minutes** for build and deployment
   - Watch the logs for any errors

6. **Test Backend**
   - Once deployed, your backend URL will be:
     ```
     https://pg-management-backend.onrender.com
     ```
   - Test the health endpoint:
     ```
     https://pg-management-backend.onrender.com/api/auth/health
     ```

---

## 🌐 Step 3: Deploy Frontend on Vercel

1. **Login to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select `hotel-pg-management-system`

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: Click "Edit" → Select `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add variable:
     ```
     Name: VITE_API_URL
     Value: https://pg-management-backend.onrender.com/api
     ```
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at:
     ```
     https://your-app-name.vercel.app
     ```

---

## 🔧 Step 4: Update CORS Settings

1. **Go back to Render**
   - Open your backend web service
   - Go to "Environment" tab

2. **Update CORS_ALLOWED_ORIGINS**
   - Edit the `CORS_ALLOWED_ORIGINS` variable
   - Set value to your Vercel URL:
     ```
     https://your-app-name.vercel.app,https://your-app.vercel.app
     ```
   - Click "Save Changes"
   - Backend will automatically redeploy (2-3 minutes)

---

## ✅ Step 5: Verify Deployment

### Test Backend
```bash
# Health check
curl https://pg-management-backend.onrender.com/api/auth/health

# Register a user
curl -X POST https://pg-management-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "fullName": "Test User"
  }'
```

### Test Frontend
1. Open your Vercel URL in browser
2. Try to register a new user
3. Login with the user
4. Check if dashboard loads

---

## 📝 Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month (enough for 1 service running 24/7)
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start takes 30-60 seconds
- ✅ Automatic HTTPS
- ✅ PostgreSQL free for 90 days, then $7/month

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Edge network (fast worldwide)

### Database Migration
After 90 days, you can:
1. Migrate to **Supabase** (free PostgreSQL)
2. Migrate to **Neon.tech** (free tier available)
3. Export data and upgrade Render database

### Custom Domain (Optional)
- Vercel: Free custom domain support
- Render: Free custom domain support

---

## 🐛 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Check database URL is in JDBC format
- Check logs in Render dashboard

### CORS errors
- Ensure CORS_ALLOWED_ORIGINS includes your Vercel URL
- Check both URLs (with and without www)
- Wait for backend to redeploy after changing env vars

### Frontend can't connect to backend
- Verify VITE_API_URL is correct
- Check backend is running (not sleeping)
- Open browser console for error details

### Cold starts
- First request after inactivity takes 30-60 seconds
- Consider upgrading to paid plan ($7/month) for always-on

---

## 🎉 You're Done!

Your app is now live and accessible worldwide for **FREE**!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://pg-management-backend.onrender.com
- **Database**: Hosted on Render

### Next Steps:
1. Set up custom domain (optional)
2. Enable error monitoring (Sentry free tier)
3. Set up uptime monitoring (UptimeRobot free)
4. Configure environment-specific settings
