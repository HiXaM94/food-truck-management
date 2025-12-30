-- ============================================
-- FOOD TRUCK MANAGEMENT SYSTEM - DATABASE SCHEMA (PostgreSQL)
-- ============================================

-- Drop existing tables
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS food_trucks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- TABLE 1: USERS
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ============================================
-- TABLE 2: FOOD_TRUCKS
-- ============================================
CREATE TABLE food_trucks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    current_location VARCHAR(255),
    average_price DECIMAL(10, 2),
    menu TEXT,
    operating_hours VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    image VARCHAR(255),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_food_trucks_cuisine ON food_trucks(cuisine);
CREATE INDEX idx_food_trucks_city ON food_trucks(city);
CREATE INDEX idx_food_trucks_status ON food_trucks(status);
CREATE INDEX idx_food_trucks_created_by ON food_trucks(created_by);

-- ============================================
-- TABLE 3: FAVORITES
-- ============================================
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    food_truck_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_truck_id) REFERENCES food_trucks(id) ON DELETE CASCADE,
    
    UNIQUE (user_id, food_truck_id)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_food_truck_id ON favorites(food_truck_id);

-- ============================================
-- SAMPLE DATA
-- ============================================

INSERT INTO users (username, email, password) VALUES
('john_doe', 'john@example.com', '$2b$10$rKZLvXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5Y'),
('jane_smith', 'jane@example.com', '$2b$10$rKZLvXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5Y'),
('admin', 'admin@example.com', '$2b$10$rKZLvXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5YqXqXqXqXeJ5vXJzVQZ5Y');

INSERT INTO food_trucks (name, cuisine, city, current_location, average_price, menu, operating_hours, status, image, created_by) VALUES
('Burger Paradise', 'burger', 'Paris', 'Place de la République', 12.50, '{"items": ["Classic Burger", "Cheese Burger", "Veggie Burger", "Fries"]}', 'Mon-Sat: 11AM-10PM', 'active', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 1),
('Taco Fiesta', 'tacos', 'Lyon', 'Bellecour Square', 9.00, '{"items": ["Beef Tacos", "Chicken Tacos", "Fish Tacos", "Nachos"]}', 'Tue-Sun: 12PM-9PM', 'active', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', 1),
('Sweet Dreams', 'desserts', 'Marseille', 'Vieux Port', 6.50, '{"items": ["Crepes", "Waffles", "Ice Cream", "Churros"]}', 'Daily: 2PM-11PM', 'active', 'https://images.unsplash.com/photo-1551024506-0bccd828d307', 2),
('Le Gourmet Mobile', 'burger', 'Paris', 'Champs-Élysées', 15.00, '{"items": ["Gourmet Burger", "Truffle Fries", "Craft Beer"]}', 'Wed-Sun: 6PM-12AM', 'active', 'https://images.unsplash.com/photo-1550547660-d9450f859349', 2),
('Pizza on Wheels', 'pizza', 'Nice', 'Promenade des Anglais', 11.00, '{"items": ["Margherita", "Pepperoni", "Vegetarian", "Calzone"]}', 'Mon-Fri: 5PM-10PM', 'inactive', 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 1),
('Asian Fusion Street', 'asian', 'Toulouse', 'Capitole Square', 10.50, '{"items": ["Pad Thai", "Spring Rolls", "Bao Buns", "Ramen"]}', 'Tue-Sat: 11AM-9PM', 'active', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d', 2);

INSERT INTO favorites (user_id, food_truck_id) VALUES
(1, 1),
(1, 3),
(2, 2),
(2, 4),
(2, 6);
