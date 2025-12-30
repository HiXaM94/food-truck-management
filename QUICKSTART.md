# 🚀 Quick Start Guide

## ⚡ Get Started in 3 Minutes

### Step 1: Configure Database (30 seconds)

The `.env.example` file contains all configuration. For quick testing, you can use default values.

**Option A: Use Default (No MySQL installed)**
- The app will start but database features won't work
- You can still see the UI

**Option B: Setup MySQL (Recommended)**
1. Install MySQL or use XAMPP
2. Copy `.env.example` to `.env` (if not exists)
3. Update database credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=food_truck_management
   ```

### Step 2: Initialize Database (30 seconds)

```bash
npm run db:init
```

This creates:
- Database and tables
- Sample food trucks
- Test user accounts

**Test Credentials:**
- Email: `john@example.com`
- Password: `password123`

### Step 3: Start the Server (10 seconds)

```bash
npm run dev
```

### Step 4: Open Your Browser (10 seconds)

Navigate to: **http://localhost:3000**

---

## 🎯 What You Can Do

### Without Login (Guest)
✅ Browse all food trucks  
✅ Search and filter by cuisine, city, status  
✅ View food truck details  
✅ Register a new account  

### After Login
✅ All guest features  
✅ Add new food trucks  
✅ Edit your own food trucks  
✅ Delete your own food trucks  
✅ Add food trucks to favorites ❤️  
✅ View your favorites collection  

---

## 🧪 Quick Test

### 1. Register a New Account
1. Click "Register" button
2. Fill in username, email, password
3. Click "Create Account"
4. You're automatically logged in!

### 2. Add a Food Truck
1. Click "Add Truck" in navigation
2. Fill in the form:
   - Name: "My Awesome Truck"
   - Cuisine: Select "Burger"
   - City: "Paris"
   - Price: 15.00
3. Click "Add Food Truck"
4. See your truck in the list!

### 3. Add to Favorites
1. Browse food trucks on home page
2. Click the heart icon ❤️ on any truck
3. Click "My Favorites" to see your collection

---

## 🔧 Troubleshooting

### "Database connection failed"
- Check MySQL is running
- Verify credentials in `.env`
- Run `npm run db:init`

### "Port 3000 already in use"
- Change `PORT=3001` in `.env`
- Or stop the other process using port 3000

### "Module not found"
- Run `npm install` again
- Check you're in the correct directory

---

## 📱 Features Showcase

### Modern UI
- 🎨 Premium gradient design
- ✨ Smooth animations
- 📱 Fully responsive
- 🌙 Beautiful color scheme

### Search & Filters
- 🔍 Real-time search
- 🍔 Filter by cuisine (10 types)
- 🏙️ Filter by city
- 🟢 Filter by status (active/inactive)

### Pagination
- 📄 6 items per page
- ⏮️ Previous/Next navigation
- 🔢 Page numbers

### Security
- 🔐 JWT authentication
- 🔒 Password hashing (bcrypt)
- ✅ Input validation
- 🛡️ Protected routes

---

## 📚 Next Steps

1. **Customize**: Edit colors in `frontend/css/style.css`
2. **Deploy**: Follow `docs/DEPLOYMENT.md` for Vercel deployment
3. **n8n**: Setup automated scraping with `n8n/README.md`
4. **API**: Test endpoints with Postman or curl

---

## 🎓 Learning Resources

### Project Structure
```
Food Truck Management/
├── backend/          ← Server code (Node.js + Express)
├── frontend/         ← Client code (HTML/CSS/JS)
├── docs/            ← Documentation & UML diagrams
└── n8n/             ← Automation workflows
```

### Key Files
- `backend/server.js` - Main server file
- `frontend/index.html` - Main page
- `frontend/js/app.js` - Application logic
- `docs/database-schema.sql` - Database structure

---

## 💡 Tips

1. **Use DevTools**: Press F12 to see console logs
2. **Check Network**: Monitor API calls in Network tab
3. **LocalStorage**: View stored token in Application tab
4. **Database**: Use MySQL Workbench to view data

---

## 🆘 Need Help?

1. Check `README.md` for full documentation
2. Review `docs/DEPLOYMENT.md` for deployment
3. See `docs/UML_DOCUMENTATION.md` for architecture
4. Check console for error messages

---

**Ready to build amazing food truck apps! 🚚✨**
