// ============================================
// SCRAPER ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');
const { authenticateToken } = require('../middleware/auth');

// All scraper routes require authentication
router.use(authenticateToken);

// @route   POST /api/scraper/google-maps
// @desc    Scrape food truck data from Google Maps
// @access  Private
router.post('/google-maps', scraperController.scrapeGoogleMaps);

module.exports = router;
