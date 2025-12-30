const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { initDatabase } = require('./config/initDb'); // Import initDb

// ... (existing imports)

// ...

const startServer = async () => {
    try {
        // Test database connection
        const dbConnected = await testConnection();

        if (dbConnected) {
            // Initialize database tables if connected
            await initDatabase();
        } else {
            console.error('⚠️  Warning: Database connection failed. Server starting anyway...');
        }

        // Start listening
        app.listen(PORT, () => {
            console.log('');
            console.log('🚚 ============================================');
            console.log('   FOOD TRUCK MANAGEMENT SYSTEM');
            console.log('   ============================================');
            console.log(`   🌐 Server running on: http://localhost:${PORT}`);
            console.log(`   📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`   💾 Database: ${dbConnected ? 'Connected ✅' : 'Disconnected ❌'}`);
            console.log('   ============================================');
            console.log('');
            console.log('   API Endpoints:');
            console.log('   - POST   /api/auth/register');
            console.log('   - POST   /api/auth/login');
            console.log('   - GET    /api/auth/me');
            console.log('   - GET    /api/foodtrucks');
            console.log('   - POST   /api/foodtrucks');
            console.log('   - PUT    /api/foodtrucks/:id');
            console.log('   - DELETE /api/foodtrucks/:id');
            console.log('   - POST   /api/favorites/:foodtruckId');
            console.log('   - DELETE /api/favorites/:foodtruckId');
            console.log('   - GET    /api/favorites/my-favorites');
            console.log('');
            console.log('   Press Ctrl+C to stop the server');
            console.log('   ============================================');
            console.log('');
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start the server if running directly
if (require.main === module) {
    startServer();
}

module.exports = app;
