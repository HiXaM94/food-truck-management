const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { initDatabase } = require('./config/initDb');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
const authRoutes = require('./routes/authRoutes');
const foodTruckRoutes = require('./routes/foodTruckRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const scraperRoutes = require('./routes/scraperRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/foodtrucks', foodTruckRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/scraper', scraperRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

const startServer = async () => {
    try {
        let dbConnected = false;

        // Attempt database connection and initialization
        try {
            dbConnected = await testConnection();
            if (dbConnected) {
                console.log('Database connected. Initializing tables...');
                await initDatabase();
            } else {
                console.error('⚠️ Database connection failed. API endpoints may not work.');
            }
        } catch (dbError) {
            console.error('⚠️ Database initialization error:', dbError.message);
            // We do NOT exit here, so the frontend can still be served
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
            console.log('   - POST   /api/scraper/google-maps');
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
