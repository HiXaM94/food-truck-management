const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Initialize database with schema
 */
async function initDatabase() {
    // Helper to clean connection string securely
    const getConnectionString = () => {
        const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
        if (!connectionString) return undefined;

        try {
            const url = new URL(connectionString);
            url.searchParams.delete('sslmode');
            return url.toString();
        } catch (error) {
            return connectionString;
        }
    };

    const pool = new Pool({
        connectionString: getConnectionString(),
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
        ssl: (process.env.DB_SSL === 'true' ||
            process.env.POSTGRES_URL ||
            process.env.DATABASE_URL ||
            process.env.NODE_ENV === 'production' ||
            (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1'))
            ? { rejectUnauthorized: false }
            : false
    });

    try {
        console.log('🔄 Connecting to PostgreSQL database...');
        const client = await pool.connect();
        console.log('✅ Connected to database');

        // Read and execute updated schema file
        console.log('🔄 Reading schema file...');
        const schemaPath = path.join(__dirname, '../../docs/database-schema-postgres.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('🔄 Executing schema...');
        await client.query(schema);

        console.log('✅ Database schema initialized successfully');
        client.release();

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);

    } finally {
        await pool.end();
    }
}

// Run initialization
initDatabase();
