const express = require('express');
const router = express.Router();
const { ingestFoodTrucks } = require('../controllers/ingestController');
// potentially add basic auth or api key middleware for security
// const { verifyApiKey } = require('../middleware/auth');

// POST /api/ingest/foodtrucks
router.post('/foodtrucks', ingestFoodTrucks);

module.exports = router;
