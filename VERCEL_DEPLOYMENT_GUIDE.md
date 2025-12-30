# 🚀 Vercel Deployment Guide - Food Truck Management

## ✅ Issue Fixed!

**Problem**: `Cannot find module './routes/favoriteRoutes'`  
**Solution**: Changed import from `favoriteRoutes` to `favoritesRoutes` to match actual filename  
**Status**: ✅ Fixed and pushed to GitHub

---

## 📋 Vercel Deployment Checklist

### 1️⃣ **Environment Variables in Vercel**

Go to your Vercel project → Settings → Environment Variables and add:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# JWT Secret (IMPORTANT: Use a strong secret!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# JWT Expiration
JWT_EXPIRE=7d

# Node Environment
NODE_ENV=production

# Optional: Google Maps API (for scraper)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-if-you-have-one
```

### 2️⃣ **Supabase Database Setup**

#### Get Your Connection String:
1. Go to Supabase Dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (URI format)
5. Replace `[YOUR-PASSWORD]` with your actual database password

#### Initialize Database Tables:

**Option A: Using SQL Editor in Supabase**
1. Go to Supabase → SQL Editor
2. Run this SQL script:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create food_trucks table
CREATE TABLE IF NOT EXISTS food_trucks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    current_location VARCHAR(255),
    average_price DECIMAL(10, 2),
    operating_hours TEXT,
    status VARCHAR(50) DEFAULT 'active',
    image TEXT,
    menu TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    phone VARCHAR(50),
    website VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_truck_id INTEGER NOT NULL REFERENCES food_trucks(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, food_truck_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_food_trucks_cuisine ON food_trucks(cuisine);
CREATE INDEX IF NOT EXISTS idx_food_trucks_city ON food_trucks(city);
CREATE INDEX IF NOT EXISTS idx_food_trucks_status ON food_trucks(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_food_truck_id ON favorites(food_truck_id);

-- Create view for food trucks with favorite counts
CREATE OR REPLACE VIEW food_trucks_with_favorites AS
SELECT 
    ft.*,
    COUNT(f.id) as favorite_count
FROM food_trucks ft
LEFT JOIN favorites f ON ft.id = f.food_truck_id
GROUP BY ft.id;
```

**Option B: Using Local Script (if you have access)**
```bash
npm run db:init
```

### 3️⃣ **Vercel Configuration**

Your `vercel.json` is already configured correctly:
```json
{
    "version": 2,
    "name": "food-truck-management",
    "builds": [
        {
            "src": "backend/server.js",
            "use": "@vercel/node",
            "config": {
                "includeFiles": [
                    "frontend/**",
                    "uploads/**"
                ]
            }
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "backend/server.js"
        }
    ],
    "env": {
        "NODE_ENV": "production"
    }
}
```

### 4️⃣ **Redeploy on Vercel**

After pushing the fix to GitHub:

1. **Automatic Deployment**:
   - Vercel should automatically detect the new commit
   - Wait for deployment to complete (usually 1-2 minutes)

2. **Manual Deployment** (if needed):
   - Go to Vercel Dashboard
   - Select your project
   - Click "Deployments" tab
   - Click "Redeploy" on the latest deployment

### 5️⃣ **Verify Deployment**

Once deployed, test these endpoints:

```bash
# Health check
https://your-app.vercel.app/api/health

# Should return:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-30T..."
}
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Cannot find module"
✅ **FIXED** - Changed `favoriteRoutes` to `favoritesRoutes`

### Issue 2: Database Connection Error
**Symptoms**: 500 errors, "connection refused"

**Solutions**:
1. Verify `DATABASE_URL` in Vercel environment variables
2. Make sure Supabase project is active
3. Check if password contains special characters (URL encode them)
4. Verify database is accessible from external connections

**Test Connection String Format**:
```
postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### Issue 3: JWT Authentication Fails
**Symptoms**: "Invalid token", "Token expired"

**Solutions**:
1. Verify `JWT_SECRET` is set in Vercel
2. Make sure `JWT_SECRET` is at least 32 characters
3. Clear browser cookies and try again

### Issue 4: CORS Errors
**Symptoms**: "Access-Control-Allow-Origin" errors

**Solution**: The app already has CORS enabled for all origins in production. If you need to restrict:

```javascript
// In backend/server.js
app.use(cors({
    origin: 'https://your-domain.vercel.app',
    credentials: true
}));
```

---

## 🧪 Testing Your Deployment

### 1. Test Frontend
Visit: `https://your-app.vercel.app`
- Should load the homepage
- Should see the hero section with stats
- Should see search bar and filters

### 2. Test Registration
1. Click "Register"
2. Create a new account
3. Should redirect to home page logged in

### 3. Test Login
1. Click "Login"
2. Enter credentials
3. Should see user menu in navbar

### 4. Test Food Trucks
1. Navigate to "Add Truck"
2. Fill in the form
3. Submit
4. Should see new truck on home page

### 5. Test Import/Export
1. Click "Export JSON"
2. File should download
3. Click "Import Data"
4. Upload the JSON file
5. Should import successfully

---

## 📊 Monitoring & Logs

### View Logs in Vercel:
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. Click "Functions" tab
5. View real-time logs

### Common Log Messages:
```
✅ Database connected. Initializing tables...
✅ Server running on: https://your-app.vercel.app
✅ Database: Connected ✅
```

---

## 🔐 Security Checklist

- ✅ `JWT_SECRET` is strong and unique
- ✅ Database password is secure
- ✅ `.env` file is in `.gitignore`
- ✅ Supabase RLS (Row Level Security) configured (optional but recommended)
- ✅ Rate limiting enabled in the app

---

## 🎯 Next Steps After Successful Deployment

1. **Test All Features**:
   - ✅ User registration and login
   - ✅ Add/Edit/Delete food trucks
   - ✅ Favorites functionality
   - ✅ Search and filters
   - ✅ Import/Export data
   - ✅ Google Maps scraper

2. **Optional Enhancements**:
   - Add custom domain in Vercel
   - Set up Google Maps API for real scraping
   - Configure email notifications
   - Add analytics (Vercel Analytics)

3. **Backup Strategy**:
   - Regular database backups in Supabase
   - Export data periodically using the export feature

---

## 🆘 Still Having Issues?

### Check Vercel Logs:
```bash
vercel logs your-deployment-url
```

### Check Supabase Logs:
1. Go to Supabase Dashboard
2. Select your project
3. Go to "Logs" → "Postgres Logs"

### Debug Mode:
Add to Vercel environment variables:
```
DEBUG=*
```

---

## ✅ Deployment Status

- ✅ Code fixed and pushed to GitHub
- ✅ Vercel configuration correct
- ⏳ Waiting for automatic redeployment
- ⏳ Verify environment variables are set
- ⏳ Verify database is initialized

---

**The fix has been pushed! Vercel should automatically redeploy in 1-2 minutes. Check your Vercel dashboard for deployment status.**

If you still see errors after redeployment, please:
1. Share the new error message
2. Check Vercel logs
3. Verify all environment variables are set correctly
