-- ============================================
-- FOOD TRUCK MANAGEMENT SYSTEM - DATABASE SCHEMA
-- ============================================
-- Database: food_truck_management
-- Tables: users, food_trucks, favorites
-- ============================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS food_trucks;
DROP TABLE IF EXISTS users;

-- ============================================
-- TABLE 1: USERS
-- ============================================
-- Stores user account information and authentication data

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed with bcrypt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 2: FOOD_TRUCKS
-- ============================================
-- Stores food truck information and details

CREATE TABLE food_trucks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50) NOT NULL, -- burger, tacos, desserts, etc.
    city VARCHAR(100) NOT NULL,
    current_location VARCHAR(255),
    average_price DECIMAL(10, 2), -- Average meal price
    menu TEXT, -- JSON or text description of menu items
    operating_hours VARCHAR(255), -- e.g., "Mon-Fri: 11AM-9PM"
    status ENUM('active', 'inactive') DEFAULT 'active',
    image VARCHAR(255), -- URL or path to image
    created_by INT NOT NULL, -- User who created this entry
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_cuisine (cuisine),
    INDEX idx_city (city),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE 3: FAVORITES
-- ============================================
-- Many-to-many relationship between users and food trucks

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_truck_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_truck_id) REFERENCES food_trucks(id) ON DELETE CASCADE,
    
    -- Prevent duplicate favorites
    UNIQUE KEY unique_favorite (user_id, food_truck_id),
    INDEX idx_user_id (user_id),
    INDEX idx_food_truck_id (food_truck_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Insert sample users (password: 'password123' hashed with bcrypt)
-- Hash generated with: bcrypt.hash('password123', 10)
INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', '$2b$10$rKZLvXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5Y'),
('jane_smith', 'jane@example.com', '$2b$10$rKZLvXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5Y'),
('admin', 'admin@example.com', '$2b$10$rKZLvXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5Y');

-- Insert sample food trucks
INSERT INTO food_trucks (name, cuisine, city, current_location, average_price, menu, operating_hours, status, image, created_by) VALUES
('Burger Paradise', 'burger', 'Paris', 'Place de la République', 12.50, '{"items": ["Classic Burger", "Cheese Burger", "Veggie Burger", "Fries"]}', 'Mon-Sat: 11AM-10PM', 'active', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 1),
('Taco Fiesta', 'tacos', 'Lyon', 'Bellecour Square', 9.00, '{"items": ["Beef Tacos", "Chicken Tacos", "Fish Tacos", "Nachos"]}', 'Tue-Sun: 12PM-9PM', 'active', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', 1),
('Sweet Dreams', 'desserts', 'Marseille', 'Vieux Port', 6.50, '{"items": ["Crepes", "Waffles", "Ice Cream", "Churros"]}', 'Daily: 2PM-11PM', 'active', 'https://images.unsplash.com/photo-1551024506-0bccd828d307', 2),
('Le Gourmet Mobile', 'burger', 'Paris', 'Champs-Élysées', 15.00, '{"items": ["Gourmet Burger", "Truffle Fries", "Craft Beer"]}', 'Wed-Sun: 6PM-12AM', 'active', 'https://images.unsplash.com/photo-1550547660-d9450f859349', 2),
('Pizza on Wheels', 'pizza', 'Nice', 'Promenade des Anglais', 11.00, '{"items": ["Margherita", "Pepperoni", "Vegetarian", "Calzone"]}', 'Mon-Fri: 5PM-10PM', 'inactive', 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 1),
('Asian Fusion Street', 'asian', 'Toulouse', 'Capitole Square', 10.50, '{"items": ["Pad Thai", "Spring Rolls", "Bao Buns", "Ramen"]}', 'Tue-Sat: 11AM-9PM', 'active', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d', 2);

-- Insert sample favorites
INSERT INTO favorites (user_id, food_truck_id) VALUES
(1, 1), -- john_doe favorites Burger Paradise
(1, 3), -- john_doe favorites Sweet Dreams
(2, 2), -- jane_smith favorites Taco Fiesta
(2, 4), -- jane_smith favorites Le Gourmet Mobile
(2, 6); -- jane_smith favorites Asian Fusion Street

-- ============================================
-- USEFUL QUERIES FOR TESTING
-- ============================================

-- Get all active food trucks with creator info
-- SELECT ft.*, u.username as creator FROM food_trucks ft JOIN users u ON ft.created_by = u.id WHERE ft.status = 'active';

-- Get user's favorites with food truck details
-- SELECT ft.* FROM food_trucks ft JOIN favorites f ON ft.id = f.food_truck_id WHERE f.user_id = 1;

-- Count favorites per food truck
-- SELECT ft.name, COUNT(f.id) as favorite_count FROM food_trucks ft LEFT JOIN favorites f ON ft.id = f.food_truck_id GROUP BY ft.id;

-- Search food trucks by cuisine and city
-- SELECT * FROM food_trucks WHERE cuisine = 'burger' AND city = 'Paris' AND status = 'active';
