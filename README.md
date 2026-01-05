# 🚚 Food Truck Management System - Premium Edition

A sophisticated, full-stack food truck management application with modern UI/UX, Google Maps integration, and advanced data management features.

## ✨ New Features & Improvements

### 🎨 **Complete UI/UX Redesign**
- **Unique Color Palette**: Ocean Sunset theme (Orange #FF6B35, Blue #004E89, Teal #1A936F, Gold #F7B801)
- **Premium Animations**: Smooth transitions, hover effects, and micro-interactions
- **Glassmorphism Effects**: Modern frosted glass UI elements
- **Responsive Design**: Optimized for all screen sizes
- **Star Ratings**: Visual rating system for food trucks
- **Dynamic Stats**: Real-time statistics in hero section

### 🗺️ **Google Maps Scraper**
- Extract food truck data from Google Maps
- Intelligent cuisine type detection
- Automatic data parsing and formatting
- Bulk import functionality
- Preview results before importing
- Mock data generation for testing (ready for Google Places API integration)

### 📊 **Data Import/Export**
- **CSV Export**: Export all food trucks to CSV format
- **JSON Export**: Export with metadata and formatting
- **CSV Import**: Import food trucks from CSV files
- **JSON Import**: Support for multiple JSON structures
- Automatic data validation
- Error handling and reporting
- Duplicate detection

### 🌟 **Enhanced Features**
- Rating and review system
- Favorite counters
- Real-time status indicators
- Operating hours display
- Price range information
- Location tracking
- Enhanced search and filtering

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HiXaM94/food-truck-management.git
   cd food-truck-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/foodtruck_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Google Maps API (Optional - for production scraping)
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   ```
   https://food-truck-management.vercel.app/
   ```

## 📖 Usage Guide

### User Authentication
1. Click "Register" to create a new account
2. Login with your credentials
3. Access protected features (Add Truck, Favorites, Scraper)

### Adding Food Trucks Manually
1. Login to your account
2. Navigate to "Add Truck"
3. Fill in the food truck details
4. Submit the form

### Using Google Maps Scraper
1. Login to your account
2. Navigate to "Maps Scraper"
3. Enter a search query (e.g., "food trucks in Paris")
4. Set the number of results and search radius
5. Click "Start Scraping"
6. Review the results
7. Click "Import All to Database"

### Importing Data from Files
1. Prepare your CSV or JSON file with food truck data
2. Click "Import Data" button on the home page
3. Select your file
4. Wait for the import to complete
5. Check the results

### Exporting Data
1. Click "Export CSV" or "Export JSON" on the home page
2. The file will download automatically
3. Use the exported data for backups or analysis

## 📁 Project Structure

```
food-truck-management/
├── backend/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   └── initDb.js            # Database initialization
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── foodTruckController.js
│   │   ├── favoriteController.js
│   │   └── scraperController.js # NEW: Google Maps scraper
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validation.js        # Input validation
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodTruckRoutes.js
│   │   ├── favoriteRoutes.js
│   │   └── scraperRoutes.js     # NEW: Scraper endpoints
│   └── server.js
├── frontend/
│   ├── css/
│   │   └── style.css            # REDESIGNED: Premium styles
│   ├── js/
│   │   ├── app.js               # ENHANCED: Main application
│   │   ├── api.js               # API client
│   │   ├── auth.js              # Authentication
│   │   ├── ui.js                # ENHANCED: UI components
│   │   ├── config.js            # Configuration
│   │   ├── scraper.js           # NEW: Scraper module
│   │   └── dataManager.js       # NEW: Import/Export
│   └── index.html               # ENHANCED: New features
├── .env.example
├── package.json
└── README.md
```

## 🎨 Color Palette

The application uses a unique Ocean Sunset color scheme:

- **Primary Orange**: `#FF6B35` - Vibrant and energetic
- **Secondary Blue**: `#004E89` - Professional and trustworthy
- **Accent Teal**: `#1A936F` - Fresh and modern
- **Gold**: `#F7B801` - Premium and warm

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Food Trucks
- `GET /api/foodtrucks` - Get all food trucks (with pagination & filters)
- `GET /api/foodtrucks/:id` - Get single food truck
- `POST /api/foodtrucks` - Create food truck (auth required)
- `PUT /api/foodtrucks/:id` - Update food truck (auth required)
- `DELETE /api/foodtrucks/:id` - Delete food truck (auth required)

### Favorites
- `POST /api/favorites/:foodtruckId` - Add to favorites
- `DELETE /api/favorites/:foodtruckId` - Remove from favorites
- `GET /api/favorites/my-favorites` - Get user's favorites

### Scraper (NEW)
- `POST /api/scraper/google-maps` - Scrape Google Maps data

## 🔧 Configuration

### Database Schema
The application uses PostgreSQL with the following tables:
- `users` - User accounts
- `food_trucks` - Food truck listings
- `favorites` - User favorites

### Environment Variables
See `.env.example` for all available configuration options.

## 🌐 Deployment

### Deploying to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Complete redesign with new features"
   git push origin main
   ```

2. **Configure Vercel**
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy

3. **Database Setup**
   - Use Supabase or another PostgreSQL provider
   - Update `DATABASE_URL` in Vercel environment variables

## 📝 CSV/JSON Format

### CSV Format
```csv
name,cuisine,city,current_location,average_price,operating_hours,status,image,menu
Burger Paradise,burger,Paris,Place de la République,12.50,Mon-Sat: 11AM-10PM,active,https://example.com/image.jpg,"{""items"": [""Classic Burger""]}"
```

### JSON Format
```json
{
  "exportDate": "2025-12-30T14:00:00.000Z",
  "totalRecords": 1,
  "data": [
    {
      "name": "Burger Paradise",
      "cuisine": "burger",
      "city": "Paris",
      "current_location": "Place de la République",
      "average_price": 12.50,
      "operating_hours": "Mon-Sat: 11AM-10PM",
      "status": "active",
      "image": "https://example.com/image.jpg",
      "menu": "{\"items\": [\"Classic Burger\"]}"
    }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Unsplash for placeholder images

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Built with ❤️ using Node.js, Express, PostgreSQL, and Vanilla JavaScript**
