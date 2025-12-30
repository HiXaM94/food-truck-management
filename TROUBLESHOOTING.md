# 🔧 TROUBLESHOOTING - Server Error During Login

## ❌ Problem
You're getting "Server error during login" because the database connection is failing.

## ✅ Solution

### Step 1: Update Database Password

Open the `.env` file and update your MySQL password:

```env
# Find this line:
DB_PASSWORD=

# Replace with your actual MySQL password:
DB_PASSWORD=your_actual_mysql_password
```

**Common MySQL passwords:**
- If using XAMPP: Usually empty (`DB_PASSWORD=`)
- If you set a password: Use that password
- Default root password: Often empty or `root`

### Step 2: Initialize Database

After updating the password, run:

```bash
npm run db:init
```

This will:
- Create the `food_truck_management` database
- Create tables (users, food_trucks, favorites)
- Insert sample data

### Step 3: Restart Server

Stop the current server (Ctrl+C) and restart:

```bash
npm run dev
```

---

## 🔍 How to Find Your MySQL Password

### Option 1: XAMPP Users
1. Open XAMPP Control Panel
2. MySQL password is usually **empty** by default
3. Set `DB_PASSWORD=` (leave it empty)

### Option 2: Standalone MySQL
1. You set this during MySQL installation
2. Try common defaults: `root`, `password`, `admin`
3. Or reset it using MySQL Workbench

### Option 3: Check phpMyAdmin
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. If it logs in without password, use empty password
3. If it asks for password, use that same password

---

## 📝 Complete .env Configuration

Here's what your `.env` should look like:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (UPDATE THESE!)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=              # ← PUT YOUR PASSWORD HERE
DB_NAME=food_truck_management
DB_PORT=3306

# JWT Configuration (already set)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=*

# n8n Webhook Configuration (optional)
N8N_WEBHOOK_URL=
N8N_API_KEY=

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🧪 Test Database Connection

After updating `.env`, test the connection:

```bash
npm run db:init
```

**Expected output:**
```
🔄 Connecting to MySQL server...
✅ Connected to MySQL server
🔄 Creating database: food_truck_management...
✅ Database food_truck_management created or already exists
🔄 Reading schema file...
🔄 Executing schema...
✅ Database schema initialized successfully

📊 Database Summary:
   - Database: food_truck_management
   - Tables: users, food_trucks, favorites
   - Sample data: Loaded

🎉 Database initialization complete!
```

---

## 🚀 Quick Fix Commands

```bash
# 1. Update .env with your MySQL password
# (Edit the file manually)

# 2. Initialize database
npm run db:init

# 3. Restart server
npm run dev

# 4. Test in browser
# Open: http://localhost:3000
# Login with: john@example.com / password123
```

---

## 💡 Alternative: Use Empty Password

If you're using XAMPP with default settings:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=food_truck_management
DB_PORT=3306
```

Then run:
```bash
npm run db:init
npm run dev
```

---

## 🆘 Still Having Issues?

### Check MySQL is Running
```bash
# Windows
Get-Service MySQL
```

### Check MySQL Port
Default is 3306. If different, update `DB_PORT` in `.env`

### Check MySQL User
Default is `root`. If different, update `DB_USER` in `.env`

### View Server Logs
The server console will show detailed error messages.

---

## ✅ Success Indicators

When everything is working:

1. **Database Init**: Shows "✅ Database schema initialized successfully"
2. **Server Start**: Shows "✅ Database: Connected ✅"
3. **Login**: Works without "Server error during login"

---

**Need more help? Check the server console for detailed error messages!**
