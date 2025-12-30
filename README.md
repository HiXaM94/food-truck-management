# 🚚 Food Truck Management System

## 📋 Project Overview

A comprehensive full-stack web application for managing food trucks with authentication, CRUD operations, favorites system, and automated data scraping via n8n workflow integration.

**Deadline**: Sunday at 12AM  
**Duration**: 4-5 days

## 🎯 Features

### Core Functionality
- ✅ **JWT Authentication** - Secure user registration and login
- ✅ **Food Truck CRUD** - Complete Create, Read, Update, Delete operations
- ✅ **Favorites System** - Save and manage favorite food trucks
- ✅ **Search & Filter** - Advanced filtering by cuisine, city, status
- ✅ **Pagination** - 6 items per page
- ✅ **Image Upload** - Food truck images
- ✅ **n8n Integration** - Automated Google Maps scraping

### Food Truck Attributes
- Name
- Cuisine Type (Burger, Tacos, Desserts, etc.)
- City
- Current Location
- Average Price
- Menu
- Operating Hours
- Status (Active/Inactive)
- Image

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Supabase)
- **Authentication**: JWT (jsonwebtoken + bcrypt)
- **Validation**: Joi
- **File Upload**: Multer

### Frontend
- **Core**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Modern, Premium UI with animations
- **Icons**: Font Awesome / Custom SVG

### DevOps & Automation
- **Hosting**: Vercel (Frontend + Backend)
- **Database**: Supabase (PostgreSQL/MySQL)
- **Automation**: n8n (Google Maps scraping)

## 📐 UML Diagrams

Located in `/docs/uml/`:
1. Use Case Diagram
2. Class Diagram
3. Sequence Diagram (Authentication Flow)

## 🗄️ Database Schema

### Tables
1. **users** - User accounts and authentication
2. **food_trucks** - Food truck information
3. **favorites** - User favorites (many-to-many)

See `/docs/database-schema.sql` for complete schema.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL or PostgreSQL database
- n8n instance (optional for scraping)

### Installation

1. **Clone the repository**
```bash
cd "f:\Food Truck Management"
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database and JWT credentials
```

4. **Initialize database**
```bash
npm run db:init
```

5. **Start development server**
```bash
npm run dev
```

6. **Access the application**
```
http://localhost:3000
```

## 📁 Project Structure

```
Food Truck Management/
├── docs/                    # UML diagrams and documentation
│   ├── uml/
│   └── database-schema.sql
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database and JWT config
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── models/             # Database models
│   └── server.js           # Entry point
├── frontend/               # HTML/CSS/JS frontend
│   ├── assets/            # Images, icons
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   └── index.html         # Main page
├── n8n/                   # n8n workflow definitions
├── uploads/               # User-uploaded images
├── .env.example          # Environment template
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Food Trucks
- `GET /api/foodtrucks` - Get all food trucks (public)
- `GET /api/foodtrucks/:id` - Get single food truck (public)
- `POST /api/foodtrucks` - Create food truck (protected)
- `PUT /api/foodtrucks/:id` - Update food truck (protected)
- `DELETE /api/foodtrucks/:id` - Delete food truck (protected)

### Favorites
- `POST /api/favorites/:foodtruckId` - Add to favorites (protected)
- `DELETE /api/favorites/:foodtruckId` - Remove from favorites (protected)
- `GET /api/favorites/my-favorites` - Get user's favorites (protected)

## 🎨 Design Principles

- **Modern & Premium**: Vibrant colors, gradients, glassmorphism
- **Responsive**: Mobile-first design
- **Interactive**: Smooth animations and hover effects
- **Accessible**: Semantic HTML, ARIA labels

## 🔄 n8n Workflow

The n8n workflow scrapes Google Maps for food trucks and street food vendors:
1. Trigger: Manual or scheduled
2. Google Maps API search
3. Data extraction and transformation
4. Database insertion via API

## 📝 License

MIT License - Feel free to use for educational purposes

## 👨‍💻 Author

Created as part of a Full Stack Development project

---

**Last Updated**: December 2025
