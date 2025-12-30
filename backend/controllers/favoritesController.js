const { query } = require('../config/database');

/**
 * Add food truck to favorites
 * POST /api/favorites/:foodtruckId
 * Protected route
 */
const addFavorite = async (req, res) => {
    try {
        const { foodtruckId } = req.params;
        const userId = req.user.id;

        // Check if food truck exists
        const foodTrucks = await query(
            'SELECT id FROM food_trucks WHERE id = $1',
            [foodtruckId]
        );

        if (foodTrucks.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Food truck not found'
            });
        }

        // Check if already favorited
        const existing = await query(
            'SELECT id FROM favorites WHERE user_id = $1 AND food_truck_id = $2',
            [userId, foodtruckId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Food truck already in favorites'
            });
        }

        // Add to favorites
        await query(
            'INSERT INTO favorites (user_id, food_truck_id) VALUES ($1, $2)',
            [userId, foodtruckId]
        );

        res.status(201).json({
            success: true,
            message: 'Food truck added to favorites'
        });

    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Remove food truck from favorites
 * DELETE /api/favorites/:foodtruckId
 * Protected route
 */
const removeFavorite = async (req, res) => {
    try {
        const { foodtruckId } = req.params;
        const userId = req.user.id;

        const result = await query(
            'DELETE FROM favorites WHERE user_id = $1 AND food_truck_id = $2',
            [userId, foodtruckId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found'
            });
        }

        res.json({
            success: true,
            message: 'Food truck removed from favorites'
        });

    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get user's favorite food trucks
 * GET /api/favorites/my-favorites
 * Protected route
 */
const getMyFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favorites = await query(
            `SELECT ft.*, u.username as creator_username, f.created_at as favorited_at,
            (SELECT COUNT(*) FROM favorites WHERE food_truck_id = ft.id) as favorite_count
            FROM favorites f
            JOIN food_trucks ft ON f.food_truck_id = ft.id
            LEFT JOIN users u ON ft.created_by = u.id
            WHERE f.user_id = $1
            ORDER BY f.created_at DESC`,
            [userId]
        );

        // Mark all as favorited (since this is the favorites list)
        favorites.rows.forEach(truck => {
            truck.is_favorited = true;
        });

        res.json({
            success: true,
            data: favorites.rows
        });

    } catch (error) {
        console.error('Get my favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    addFavorite,
    removeFavorite,
    getMyFavorites
};
