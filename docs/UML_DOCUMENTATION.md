# 📐 UML Diagrams Documentation

## Overview

This document contains detailed explanations of the three UML diagrams created for the Food Truck Management System project.

---

## 1️⃣ Use Case Diagram

### Purpose
Illustrates the functional requirements and interactions between different actors and the system.

### Actors

#### 1. Non-Authenticated User (Guest)
**Capabilities:**
- Register Account
- Login
- View Food Trucks (browse all available food trucks)
- Search/Filter Food Trucks (by cuisine, city, status)

#### 2. Authenticated User
**Capabilities (includes all guest capabilities):**
- Logout
- Add Food Truck (create new food truck entry)
- Edit Food Truck (modify own food trucks only)
- Delete Food Truck (remove own food trucks only)
- Add to Favorites (save food trucks to personal collection)
- Remove from Favorites
- View My Favorites (see all favorited food trucks)
- Trigger Scraping (initiate n8n workflow)

#### 3. n8n System (Automated Actor)
**Capabilities:**
- Scrape Google Maps Data (extract food truck information)
- Import Food Trucks (insert scraped data into database)

### Key Relationships

**<<include>> Relationships:**
- "Add to Favorites" includes "View Food Trucks" (must view to favorite)
- "Edit Food Truck" includes authentication check
- "Delete Food Truck" includes ownership verification

**<<extend>> Relationships:**
- "Search/Filter" extends "View Food Trucks" (optional enhancement)
- "Trigger Scraping" extends "Import Food Trucks" (manual trigger option)

### Business Rules
1. Only authenticated users can perform CRUD operations
2. Users can only edit/delete their own food trucks
3. Any authenticated user can favorite any food truck
4. Search and filtering are available to all users
5. n8n system operates independently or via user trigger

---

## 2️⃣ Class Diagram

### Purpose
Defines the structure of the system's data model and relationships between entities.

### Classes

#### Class: User
**Attributes:**
- `- id: int` (Primary Key, Auto-increment)
- `- username: string` (Unique, 3-50 characters)
- `- email: string` (Unique, Valid email format)
- `- password: string` (Hashed with bcrypt)
- `- createdAt: timestamp` (Auto-generated)
- `- updatedAt: timestamp` (Auto-updated)

**Methods:**
- `+ register(): boolean` - Create new user account
- `+ login(): string` - Authenticate and return JWT token
- `+ logout(): void` - Clear session
- `+ authenticate(): boolean` - Verify JWT token

**Validation Rules:**
- Username: alphanumeric, 3-50 chars
- Email: valid email format
- Password: minimum 6 characters, hashed before storage

---

#### Class: FoodTruck
**Attributes:**
- `- id: int` (Primary Key, Auto-increment)
- `- name: string` (2-100 characters)
- `- cuisine: string` (Enum: burger, tacos, desserts, pizza, asian, mexican, italian, american, french, other)
- `- city: string` (2-100 characters)
- `- currentLocation: string` (Optional, 255 chars max)
- `- averagePrice: decimal` (Optional, 2 decimal places)
- `- menu: text` (Optional, JSON or text format)
- `- operatingHours: string` (Optional, 255 chars)
- `- status: enum` (active/inactive)
- `- image: string` (Optional, URL format)
- `- createdBy: int` (Foreign Key to User)
- `- createdAt: timestamp`
- `- updatedAt: timestamp`

**Methods:**
- `+ create(): FoodTruck` - Create new food truck
- `+ update(): boolean` - Update existing food truck
- `+ delete(): boolean` - Delete food truck
- `+ search(query: string): FoodTruck[]` - Search by name/location
- `+ filter(criteria: object): FoodTruck[]` - Filter by cuisine/city/status

**Business Logic:**
- Only the creator (createdBy) can update or delete
- Status defaults to 'active'
- Image URL is validated
- Average price must be positive

---

#### Class: Favorite
**Attributes:**
- `- id: int` (Primary Key, Auto-increment)
- `- userId: int` (Foreign Key to User)
- `- foodTruckId: int` (Foreign Key to FoodTruck)
- `- createdAt: timestamp`

**Methods:**
- `+ addFavorite(userId: int, foodTruckId: int): boolean` - Add to favorites
- `+ removeFavorite(userId: int, foodTruckId: int): boolean` - Remove from favorites
- `+ getUserFavorites(userId: int): FoodTruck[]` - Get all user's favorites

**Constraints:**
- Unique constraint on (userId, foodTruckId) - prevents duplicate favorites
- Cascade delete: if user or food truck is deleted, favorite is removed

---

### Relationships

#### User → FoodTruck (One-to-Many)
- **Cardinality**: 1 User creates 0..* FoodTrucks
- **Type**: Composition (food truck belongs to creator)
- **Foreign Key**: FoodTruck.createdBy → User.id
- **Cascade**: ON DELETE CASCADE (if user deleted, their food trucks are deleted)

#### User → Favorite (One-to-Many)
- **Cardinality**: 1 User has 0..* Favorites
- **Type**: Aggregation (favorites are independent)
- **Foreign Key**: Favorite.userId → User.id
- **Cascade**: ON DELETE CASCADE

#### FoodTruck → Favorite (One-to-Many)
- **Cardinality**: 1 FoodTruck has 0..* Favorites
- **Type**: Aggregation
- **Foreign Key**: Favorite.foodTruckId → FoodTruck.id
- **Cascade**: ON DELETE CASCADE

#### User ↔ FoodTruck (Many-to-Many via Favorite)
- **Relationship**: Users can favorite multiple food trucks, food trucks can be favorited by multiple users
- **Junction Table**: Favorite

---

## 3️⃣ Sequence Diagram - Authentication Flow

### Purpose
Illustrates the step-by-step interaction between components during user login.

### Participants

1. **User** - End user attempting to login
2. **Frontend (Web Browser)** - Client-side application
3. **Backend API (Express Server)** - Server-side application
4. **Database (MySQL)** - Data persistence layer
5. **JWT Service** - Token generation service

---

### Login Flow - Success Scenario

**Step 1: User Input**
```
User → Frontend: Enter email & password
```
User fills in login form with credentials.

**Step 2: API Request**
```
Frontend → Backend API: POST /api/auth/login
Body: { email: "user@example.com", password: "password123" }
```
Frontend sends credentials to backend.

**Step 3: Database Query**
```
Backend API → Database: SELECT * FROM users WHERE email = ?
```
Backend queries database for user with given email.

**Step 4: User Data Retrieved**
```
Database → Backend API: Return user data
Response: { id: 1, username: "john", email: "...", password: "$2b$10$..." }
```
Database returns user record including hashed password.

**Step 5: Password Verification**
```
Backend API → Backend API: bcrypt.compare(password, hash)
```
Backend compares submitted password with stored hash.

**Step 6: Token Generation**
```
Backend API → JWT Service: Generate token
Payload: { id: 1, username: "john", email: "..." }
```
If password matches, request JWT token generation.

**Step 7: Token Created**
```
JWT Service → Backend API: Return JWT token
Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
JWT service creates signed token with user data.

**Step 8: Success Response**
```
Backend API → Frontend: HTTP 200 OK
Body: {
  success: true,
  token: "eyJhbGci...",
  user: { id: 1, username: "john", email: "..." }
}
```
Backend sends token and user data to frontend.

**Step 9: Store Token**
```
Frontend → Frontend: localStorage.setItem('token', token)
```
Frontend stores token in browser's localStorage.

**Step 10: Redirect**
```
Frontend → User: Redirect to dashboard
```
User is redirected to authenticated area.

---

### Login Flow - Failure Scenario

**Alternative Path (Invalid Credentials):**

After **Step 5** (Password Verification):

```
Backend API → Frontend: HTTP 401 Unauthorized
Body: {
  success: false,
  message: "Invalid email or password"
}
```

```
Frontend → User: Show error message
Display: "Invalid email or password. Please try again."
```

**Alternative Path (User Not Found):**

After **Step 4** (Database Query):

```
Database → Backend API: Empty result set (no user found)
```

```
Backend API → Frontend: HTTP 401 Unauthorized
Body: {
  success: false,
  message: "Invalid email or password"
}
```

Note: Same error message for security (don't reveal if email exists).

---

### Security Considerations

1. **Password Hashing**: Passwords never stored in plain text
2. **JWT Expiration**: Tokens expire after 7 days (configurable)
3. **HTTPS**: All communication should use HTTPS in production
4. **Error Messages**: Generic messages to prevent user enumeration
5. **Rate Limiting**: Prevent brute force attacks (implemented in middleware)

---

### Token Usage in Subsequent Requests

After login, all protected API calls include the token:

```
Frontend → Backend API: GET /api/foodtrucks
Headers: {
  Authorization: "Bearer eyJhbGci..."
}
```

```
Backend API → Backend API: Verify token
Decode JWT and extract user data
```

```
Backend API → Frontend: Return protected data
```

---

## 🔄 Integration Between Diagrams

### How They Work Together

1. **Use Case → Class Diagram**
   - Each use case maps to methods in classes
   - "Add Food Truck" → FoodTruck.create()
   - "Add to Favorites" → Favorite.addFavorite()

2. **Class Diagram → Sequence Diagram**
   - Sequence diagram shows runtime behavior of class methods
   - User.login() method implementation shown in sequence
   - Database queries correspond to class relationships

3. **Use Case → Sequence Diagram**
   - Use case "Login" is detailed in sequence diagram
   - Shows exact steps and interactions
   - Validates use case is technically feasible

---

## 📊 Database Schema Mapping

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Food Trucks Table
```sql
CREATE TABLE food_trucks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    current_location VARCHAR(255),
    average_price DECIMAL(10, 2),
    menu TEXT,
    operating_hours VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    image VARCHAR(255),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_truck_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_truck_id) REFERENCES food_trucks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, food_truck_id)
);
```

---

## 🎯 Design Patterns Used

### 1. MVC Pattern
- **Model**: Database tables (users, food_trucks, favorites)
- **View**: Frontend HTML/CSS/JS
- **Controller**: Backend controllers (authController, foodTruckController)

### 2. Repository Pattern
- Database queries abstracted in `config/database.js`
- Reusable query functions

### 3. Middleware Pattern
- Authentication middleware (`authenticateToken`)
- Validation middleware (`validate`)
- Error handling middleware

### 4. Singleton Pattern
- Database connection pool
- Global instances (auth, api, ui)

---

## 📝 Conclusion

These UML diagrams provide a complete blueprint for the Food Truck Management System:

- **Use Case Diagram**: What the system does (functional requirements)
- **Class Diagram**: How data is structured (data model)
- **Sequence Diagram**: How components interact (behavior)

Together, they ensure:
- Clear requirements understanding
- Proper database design
- Secure authentication flow
- Maintainable codebase

---

**Created**: December 2025  
**Project**: Food Truck Management System  
**Deadline**: Sunday at 12AM
