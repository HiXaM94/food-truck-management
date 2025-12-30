const { Pool } = require('pg');
require('dotenv').config();

// Database connection pool configuration
// Supports connection string (DATABASE_URL) or individual parameters
// Helper to clean connection string securely
const getConnectionString = () => {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) return undefined;

    try {
        // Use URL API to safely manipulate parameters
        const url = new URL(connectionString);
        url.searchParams.delete('sslmode');
        return url.toString();
    } catch (error) {
        // If not a valid URL (e.g. simple string), return as is
        return connectionString;
    }
};

const pool = new Pool({
    connectionString: getConnectionString(),
    // Fallback if connection string is not set
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    // Force SSL with no verification for cloud DBs
    ssl: (process.env.POSTGRES_URL || process.env.DATABASE_URL) ? { rejectUnauthorized: false } : false
});

// Test database connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Database connected successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Execute query helper function
const query = async (text, params) => {
    try {
        const result = await pool.query(text, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

module.exports = {
    pool,
    query,
    testConnection
};
