const { pool } = require('./database');

const initDatabase = async () => {
    const client = await pool.connect();
    try {
        console.log('🔄 Checking database initialization...');

        // Begin transaction
        await client.query('BEGIN');

        // Create Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Create Food Trucks Table
        await client.query(`
             CREATE TABLE IF NOT EXISTS food_trucks (
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
        `);

        // Create Favorites Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                food_truck_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (food_truck_id) REFERENCES food_trucks(id) ON DELETE CASCADE,
                UNIQUE (user_id, food_truck_id)
            );
        `);

        await client.query('COMMIT');
        console.log('✅ Database tables initialized successfully.');
        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Database initialization failed:', error);
        return false;
    } finally {
        client.release();
    }
};

module.exports = { initDatabase };
