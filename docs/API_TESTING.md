# 🧪 API Testing Guide

Complete guide for testing all API endpoints using curl, Postman, or your browser.

---

## 🔧 Setup

### Base URL
```
Local: http://localhost:3000
Production: https://your-app.vercel.app
```

### Get a JWT Token

First, register or login to get a token:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**Save the token** for authenticated requests!

---

## 🔐 Authentication Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGci...",
  "user": {
    "id": 4,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

---

### 2. Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGci...",
  "user": {
    "id": 4,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 4,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2025-12-25T10:00:00.000Z"
  }
}
```

---

## 🚚 Food Truck Endpoints

### 1. Get All Food Trucks (Public)
```bash
# Basic request
curl http://localhost:3000/api/foodtrucks

# With pagination
curl "http://localhost:3000/api/foodtrucks?page=1&limit=6"

# With search
curl "http://localhost:3000/api/foodtrucks?search=burger"

# With filters
curl "http://localhost:3000/api/foodtrucks?cuisine=burger&city=Paris&status=active"

# Combined
curl "http://localhost:3000/api/foodtrucks?search=burger&cuisine=burger&page=1&limit=6"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Burger Paradise",
      "cuisine": "burger",
      "city": "Paris",
      "current_location": "Place de la République",
      "average_price": "12.50",
      "menu": "{\"items\": [\"Classic Burger\", \"Cheese Burger\"]}",
      "operating_hours": "Mon-Sat: 11AM-10PM",
      "status": "active",
      "image": "https://images.unsplash.com/...",
      "created_by": 1,
      "creator_username": "john_doe",
      "favorite_count": 2,
      "is_favorited": false,
      "created_at": "2025-12-25T10:00:00.000Z",
      "updated_at": "2025-12-25T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "total": 6,
    "totalPages": 1
  }
}
```

---

### 2. Get Single Food Truck (Public)
```bash
curl http://localhost:3000/api/foodtrucks/1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Burger Paradise",
    "cuisine": "burger",
    "city": "Paris",
    "current_location": "Place de la République",
    "average_price": "12.50",
    "menu": "{\"items\": [\"Classic Burger\", \"Cheese Burger\"]}",
    "operating_hours": "Mon-Sat: 11AM-10PM",
    "status": "active",
    "image": "https://images.unsplash.com/...",
    "created_by": 1,
    "creator_username": "john_doe",
    "favorite_count": 2,
    "is_favorited": false
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Food truck not found"
}
```

---

### 3. Create Food Truck (Protected)
```bash
curl -X POST http://localhost:3000/api/foodtrucks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Taco Fiesta",
    "cuisine": "tacos",
    "city": "Lyon",
    "current_location": "Bellecour Square",
    "average_price": 9.50,
    "menu": "{\"items\": [\"Beef Tacos\", \"Chicken Tacos\"]}",
    "operating_hours": "Tue-Sun: 12PM-9PM",
    "status": "active",
    "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Food truck created successfully",
  "data": {
    "id": 7,
    "name": "Taco Fiesta",
    "cuisine": "tacos",
    "city": "Lyon",
    "current_location": "Bellecour Square",
    "average_price": "9.50",
    "menu": "{\"items\": [\"Beef Tacos\", \"Chicken Tacos\"]}",
    "operating_hours": "Tue-Sun: 12PM-9PM",
    "status": "active",
    "image": "https://images.unsplash.com/...",
    "created_by": 4
  }
}
```

**Error Response (400 - Validation):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Food truck name is required"
    }
  ]
}
```

---

### 4. Update Food Truck (Protected - Creator Only)
```bash
curl -X PUT http://localhost:3000/api/foodtrucks/7 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Taco Fiesta Deluxe",
    "cuisine": "tacos",
    "city": "Lyon",
    "current_location": "Part-Dieu",
    "average_price": 11.00,
    "menu": "{\"items\": [\"Beef Tacos\", \"Chicken Tacos\", \"Fish Tacos\"]}",
    "operating_hours": "Daily: 11AM-10PM",
    "status": "active",
    "image": "https://images.unsplash.com/..."
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Food truck updated successfully",
  "data": {
    "id": 7,
    "name": "Taco Fiesta Deluxe",
    "cuisine": "tacos",
    "city": "Lyon",
    "current_location": "Part-Dieu",
    "average_price": "11.00",
    "menu": "{\"items\": [\"Beef Tacos\", \"Chicken Tacos\", \"Fish Tacos\"]}",
    "operating_hours": "Daily: 11AM-10PM",
    "status": "active",
    "image": "https://images.unsplash.com/...",
    "created_by": 4
  }
}
```

**Error Response (403 - Not Creator):**
```json
{
  "success": false,
  "message": "You are not authorized to update this food truck"
}
```

---

### 5. Delete Food Truck (Protected - Creator Only)
```bash
curl -X DELETE http://localhost:3000/api/foodtrucks/7 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Food truck deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "You are not authorized to delete this food truck"
}
```

---

## ❤️ Favorites Endpoints

### 1. Add to Favorites (Protected)
```bash
curl -X POST http://localhost:3000/api/favorites/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Food truck added to favorites"
}
```

**Error Response (400 - Already Favorited):**
```json
{
  "success": false,
  "message": "Food truck already in favorites"
}
```

**Error Response (404 - Truck Not Found):**
```json
{
  "success": false,
  "message": "Food truck not found"
}
```

---

### 2. Remove from Favorites (Protected)
```bash
curl -X DELETE http://localhost:3000/api/favorites/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Food truck removed from favorites"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Favorite not found"
}
```

---

### 3. Get My Favorites (Protected)
```bash
curl http://localhost:3000/api/favorites/my-favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Burger Paradise",
      "cuisine": "burger",
      "city": "Paris",
      "current_location": "Place de la République",
      "average_price": "12.50",
      "menu": "{\"items\": [\"Classic Burger\", \"Cheese Burger\"]}",
      "operating_hours": "Mon-Sat: 11AM-10PM",
      "status": "active",
      "image": "https://images.unsplash.com/...",
      "created_by": 1,
      "creator_username": "john_doe",
      "favorited_at": "2025-12-25T12:00:00.000Z",
      "favorite_count": 3,
      "is_favorited": true
    }
  ]
}
```

---

## 🧪 Postman Collection

### Import to Postman

Create a new collection with these requests:

**Environment Variables:**
```
base_url: http://localhost:3000
token: (set after login)
```

**Requests:**
1. Auth - Register
2. Auth - Login
3. Auth - Get Current User
4. Food Trucks - Get All
5. Food Trucks - Get One
6. Food Trucks - Create
7. Food Trucks - Update
8. Food Trucks - Delete
9. Favorites - Add
10. Favorites - Remove
11. Favorites - Get My Favorites

---

## 🔍 Testing Scenarios

### Scenario 1: New User Journey
1. Register new account
2. Login (get token)
3. Browse food trucks
4. Add food truck to favorites
5. View my favorites
6. Create new food truck
7. Edit own food truck
8. Delete own food truck

### Scenario 2: Search & Filter
1. Search for "burger"
2. Filter by cuisine "tacos"
3. Filter by city "Paris"
4. Filter by status "active"
5. Combine filters
6. Test pagination

### Scenario 3: Authorization
1. Try to create without token (401)
2. Try to edit someone else's truck (403)
3. Try to delete someone else's truck (403)
4. Try to access protected route (401)

### Scenario 4: Validation
1. Register with invalid email (400)
2. Register with short password (400)
3. Create truck with missing fields (400)
4. Create truck with invalid cuisine (400)

---

## 📊 Expected HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (create) |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Not authorized (not owner) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## 🐛 Common Errors

### "Access denied. No token provided."
**Solution**: Add Authorization header with Bearer token

### "Invalid or expired token"
**Solution**: Login again to get new token

### "Food truck not found"
**Solution**: Check the ID exists in database

### "You are not authorized to update this food truck"
**Solution**: You can only edit your own food trucks

---

## 💡 Tips

1. **Save Token**: After login, save the token for subsequent requests
2. **Use Variables**: In Postman, use environment variables for base_url and token
3. **Check Response**: Always check the response status and message
4. **Test Edge Cases**: Try invalid data, missing fields, unauthorized access
5. **Monitor Console**: Check server console for detailed error logs

---

**Happy Testing! 🧪✨**
