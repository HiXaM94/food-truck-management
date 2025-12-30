# 🚀 Deployment Guide - Food Truck Management System

## 📋 Prerequisites

- Node.js 16+ installed
- MySQL database (local or Supabase)
- Vercel account (for deployment)
- n8n instance (optional, for scraping)

---

## 🔧 Local Development Setup

### 1. Install Dependencies

```bash
cd "f:\Food Truck Management"
npm install
```

### 2. Configure Environment

The `.env` file is already created with default values. Update these settings:

```env
# Database - Update with your MySQL credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=food_truck_management

# JWT - Change this secret in production!
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

### 3. Initialize Database

```bash
npm run db:init
```

This will:
- Create the database
- Create tables (users, food_trucks, favorites)
- Insert sample data

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 5. Test the Application

**Default test user** (from sample data):
- Email: `john@example.com`
- Password: `password123`

---

## 🌐 Production Deployment (Vercel)

### 1. Prepare for Deployment

Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### 2. Setup Supabase Database

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy connection details:
   - Host: `db.xxxxx.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - User: `postgres`
   - Password: (your password)

5. Run the schema SQL in Supabase SQL Editor:
   - Copy content from `docs/database-schema.sql`
   - Paste in SQL Editor
   - Execute

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### 4. Configure Environment Variables in Vercel

In Vercel Dashboard > Settings > Environment Variables, add:

```
NODE_ENV=production
PORT=3000

# Supabase Database
DB_HOST=db.xxxxx.supabase.co
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_NAME=postgres
DB_PORT=5432

# JWT Secret (generate a strong one!)
JWT_SECRET=your_production_jwt_secret_here

# CORS
CORS_ORIGIN=https://your-app.vercel.app
```

### 5. Redeploy

```bash
vercel --prod
```

---

## 🔄 n8n Workflow Setup (Optional)

### 1. Deploy n8n

Options:
- **n8n Cloud**: https://n8n.io/cloud
- **Self-hosted**: https://docs.n8n.io/hosting/

### 2. Import Workflow

1. Open n8n dashboard
2. Click "Import from File"
3. Select `n8n/google-maps-scraper.json`
4. Activate workflow

### 3. Configure Webhook

1. Copy webhook URL from n8n
2. Add to your `.env`:
   ```
   N8N_WEBHOOK_URL=https://your-n8n.app/webhook/scrape-foodtrucks
   ```

### 4. Test Scraping

```bash
curl -X POST https://your-n8n.app/webhook/scrape-foodtrucks \
  -H "Content-Type: application/json" \
  -d '{"city": "Paris"}'
```

---

## 🧪 Testing

### Test Authentication

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Food Trucks API

```bash
# Get all food trucks
curl http://localhost:3000/api/foodtrucks

# Get with filters
curl "http://localhost:3000/api/foodtrucks?cuisine=burger&city=Paris"

# Create food truck (requires auth)
curl -X POST http://localhost:3000/api/foodtrucks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Truck","cuisine":"burger","city":"Paris"}'
```

### Test Favorites

```bash
# Add to favorites
curl -X POST http://localhost:3000/api/favorites/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get my favorites
curl http://localhost:3000/api/favorites/my-favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Database Connection Failed

**Error**: `ER_ACCESS_DENIED_ERROR`

**Solution**: Check your database credentials in `.env`

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**: 
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port in .env
PORT=3001
```

### JWT Token Invalid

**Error**: `Invalid or expired token`

**Solution**: 
- Clear localStorage in browser
- Login again
- Check JWT_SECRET matches between client and server

### CORS Error

**Error**: `Access to fetch blocked by CORS policy`

**Solution**: Update `CORS_ORIGIN` in `.env` to match your frontend URL

---

## 📊 Database Management

### Backup Database

```bash
# MySQL
mysqldump -u root -p food_truck_management > backup.sql

# Supabase (use Supabase dashboard)
```

### Reset Database

```bash
npm run db:init
```

### View Database

```bash
# MySQL
mysql -u root -p
USE food_truck_management;
SHOW TABLES;
SELECT * FROM food_trucks;
```

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS in production
- [ ] Set CORS_ORIGIN to your domain only
- [ ] Use strong database passwords
- [ ] Implement rate limiting (already included)
- [ ] Validate all user inputs (already included)
- [ ] Hash passwords with bcrypt (already included)

---

## 📈 Performance Optimization

### Enable Compression

```bash
npm install compression
```

Add to `backend/server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### Enable Caching

Add caching headers for static files in `backend/server.js`:
```javascript
app.use(express.static('frontend', {
  maxAge: '1d',
  etag: true
}));
```

### Database Indexing

Already included in schema:
- Indexes on frequently queried columns
- Foreign key indexes
- Unique constraints

---

## 📞 Support

For issues or questions:
- Review this deployment guide
- Check application logs
- Test API endpoints individually
- Verify environment variables

---

**Last Updated**: December 2025
