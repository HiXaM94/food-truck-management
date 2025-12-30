const express = require('express');
const router = express.Router();
const {
    addFavorite,
    removeFavorite,
    getMyFavorites
} = require('../controllers/favoritesController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/favorites/:foodtruckId
 * @desc    Add food truck to favorites
 * @access  Protected
 */
router.post('/:foodtruckId', authenticateToken, addFavorite);

/**
 * @route   DELETE /api/favorites/:foodtruckId
 * @desc    Remove food truck from favorites
 * @access  Protected
 */
router.delete('/:foodtruckId', authenticateToken, removeFavorite);

/**
 * @route   GET /api/favorites/my-favorites
 * @desc    Get user's favorite food trucks
 * @access  Protected
 */
router.get('/my-favorites', authenticateToken, getMyFavorites);

module.exports = router;
