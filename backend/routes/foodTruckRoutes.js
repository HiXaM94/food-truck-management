const express = require('express');
const router = express.Router();
const {
    getAllFoodTrucks,
    getFoodTruckById,
    createFoodTruck,
    updateFoodTruck,
    deleteFoodTruck
} = require('../controllers/foodTruckController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validate, foodTruckSchema } = require('../middleware/validation');

/**
 * @route   GET /api/foodtrucks
 * @desc    Get all food trucks with pagination, search, and filters
 * @access  Public (optionalAuth to check favorites)
 * @query   search, cuisine, city, status, page, limit
 */
router.get('/', optionalAuth, getAllFoodTrucks);

/**
 * @route   GET /api/foodtrucks/:id
 * @desc    Get single food truck by ID
 * @access  Public (optionalAuth to check favorites)
 */
router.get('/:id', optionalAuth, getFoodTruckById);

/**
 * @route   POST /api/foodtrucks
 * @desc    Create new food truck
 * @access  Protected
 */
router.post('/', authenticateToken, validate(foodTruckSchema), createFoodTruck);

/**
 * @route   PUT /api/foodtrucks/:id
 * @desc    Update food truck (only by creator)
 * @access  Protected
 */
router.put('/:id', authenticateToken, validate(foodTruckSchema), updateFoodTruck);

/**
 * @route   DELETE /api/foodtrucks/:id
 * @desc    Delete food truck (only by creator)
 * @access  Protected
 */
router.delete('/:id', authenticateToken, deleteFoodTruck);

module.exports = router;
