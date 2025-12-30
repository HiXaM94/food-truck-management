const { query } = require('../config/database');

/**
 * Get all food trucks with pagination, search, and filters
 * GET /api/foodtrucks
 * Query params: search, cuisine, city, status, page, limit
 */
const getAllFoodTrucks = async (req, res) => {
    try {
        const {
            search = '',
            cuisine = '',
            city = '',
            status = '',
            page = 1,
            limit = 6
        } = req.query;

        const offset = (page - 1) * limit;

        // Build dynamic query
        let sql = `
            SELECT ft.*, u.username as creator_username,
            (SELECT COUNT(*) FROM favorites WHERE food_truck_id = ft.id) as favorite_count
            FROM food_trucks ft
            LEFT JOIN users u ON ft.created_by = u.id
            WHERE 1=1
        `;
        const params = [];
        let pIdx = 1;

        // Add search filter
        if (search) {
            sql += ` AND (ft.name ILIKE $${pIdx} OR ft.city ILIKE $${pIdx + 1} OR ft.current_location ILIKE $${pIdx + 2})`;
            // Postgres ILIKE is case insensitive
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
            pIdx += 3;
        }

        // Add cuisine filter
        if (cuisine) {
            sql += ` AND ft.cuisine = $${pIdx}`;
            params.push(cuisine);
            pIdx++;
        }

        // Add city filter
        if (city) {
            sql += ` AND ft.city ILIKE $${pIdx}`;
            params.push(`%${city}%`);
            pIdx++;
        }

        // Add status filter
        if (status) {
            sql += ` AND ft.status = $${pIdx}`;
            params.push(status);
            pIdx++;
        }

        // Get total count for pagination
        // Basic replacement of SELECT part.
        // Note: replace should be careful if we have multiple matching strings.
        // We replace the main SELECT columns with COUNT(*).
        const countSql = `SELECT COUNT(*) as total FROM food_trucks ft LEFT JOIN users u ON ft.created_by = u.id WHERE 1=1 ` + sql.substring(sql.indexOf('WHERE 1=1') + 9);

        // Wait, my substring logic above duplicates the WHERE clause conditions if I am not careful, 
        // but actually I just want to append the same conditions.
        // Let's reconstruct countSql cleaner.
        // The conditions are in 'sql' after 'WHERE 1=1'.
        const whereClause = sql.substring(sql.indexOf('WHERE 1=1') + 9); // gets " AND ..."
        const finalCountSql = `SELECT COUNT(*) as total FROM food_trucks ft WHERE 1=1 ${whereClause}`;

        const countResult = await query(finalCountSql, params);
        const total = parseInt(countResult.rows[0].total);

        // Add sorting and pagination
        sql += ` ORDER BY ft.created_at DESC LIMIT $${pIdx} OFFSET $${pIdx + 1}`;
        params.push(parseInt(limit), parseInt(offset));

        const foodTrucks = await query(sql, params);

        // If user is authenticated, check which trucks are favorited
        if (req.user) {
            const favoriteIds = await query(
                'SELECT food_truck_id FROM favorites WHERE user_id = $1',
                [req.user.id]
            );
            const favoriteSet = new Set(favoriteIds.rows.map(f => f.food_truck_id));

            foodTrucks.rows.forEach(truck => {
                truck.is_favorited = favoriteSet.has(truck.id);
            });
        }

        res.json({
            success: true,
            data: foodTrucks.rows,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Get all food trucks error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Get single food truck by ID
 * GET /api/foodtrucks/:id
 */
const getFoodTruckById = async (req, res) => {
    try {
        const { id } = req.params;

        const foodTrucks = await query(
            `SELECT ft.*, u.username as creator_username,
            (SELECT COUNT(*) FROM favorites WHERE food_truck_id = ft.id) as favorite_count
            FROM food_trucks ft
            LEFT JOIN users u ON ft.created_by = u.id
            WHERE ft.id = $1`,
            [id]
        );

        if (foodTrucks.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Food truck not found'
            });
        }

        const foodTruck = foodTrucks.rows[0];

        // Check if favorited by current user
        if (req.user) {
            const favorites = await query(
                'SELECT id FROM favorites WHERE user_id = $1 AND food_truck_id = $2',
                [req.user.id, id]
            );
            foodTruck.is_favorited = favorites.rows.length > 0;
        }

        res.json({
            success: true,
            data: foodTruck
        });

    } catch (error) {
        console.error('Get food truck by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Create new food truck
 * POST /api/foodtrucks
 * Protected route - requires authentication
 */
const createFoodTruck = async (req, res) => {
    try {
        const {
            name,
            cuisine,
            city,
            current_location,
            average_price,
            menu,
            operating_hours,
            status,
            image
        } = req.body;

        const userId = req.user.id;

        const result = await query(
            `INSERT INTO food_trucks 
            (name, cuisine, city, current_location, average_price, menu, operating_hours, status, image, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [name, cuisine, city, current_location || null, average_price || null,
                menu || null, operating_hours || null, status || 'active', image || null, userId]
        );

        const newFoodTruckId = result.rows[0].id;

        const newFoodTruck = await query(
            'SELECT * FROM food_trucks WHERE id = $1',
            [newFoodTruckId]
        );

        res.status(201).json({
            success: true,
            message: 'Food truck created successfully',
            data: newFoodTruck.rows[0]
        });

    } catch (error) {
        console.error('Create food truck error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Update food truck
 * PUT /api/foodtrucks/:id
 * Protected route - only creator can update
 */
const updateFoodTruck = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if food truck exists and user is the creator
        const foodTrucks = await query(
            'SELECT * FROM food_trucks WHERE id = $1',
            [id]
        );

        if (foodTrucks.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Food truck not found'
            });
        }

        if (foodTrucks.rows[0].created_by !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this food truck'
            });
        }

        const {
            name,
            cuisine,
            city,
            current_location,
            average_price,
            menu,
            operating_hours,
            status,
            image
        } = req.body;

        await query(
            `UPDATE food_trucks SET
            name = $1, cuisine = $2, city = $3, current_location = $4,
            average_price = $5, menu = $6, operating_hours = $7, status = $8, image = $9
            WHERE id = $10`,
            [name, cuisine, city, current_location || null, average_price || null,
                menu || null, operating_hours || null, status || 'active', image || null, id]
        );

        const updatedFoodTruck = await query(
            'SELECT * FROM food_trucks WHERE id = $1',
            [id]
        );

        res.json({
            success: true,
            message: 'Food truck updated successfully',
            data: updatedFoodTruck.rows[0]
        });

    } catch (error) {
        console.error('Update food truck error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * Delete food truck
 * DELETE /api/foodtrucks/:id
 * Protected route - only creator can delete
 */
const deleteFoodTruck = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if food truck exists and user is the creator
        const foodTrucks = await query(
            'SELECT * FROM food_trucks WHERE id = $1',
            [id]
        );

        if (foodTrucks.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Food truck not found'
            });
        }

        if (foodTrucks.rows[0].created_by !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this food truck'
            });
        }

        await query('DELETE FROM food_trucks WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Food truck deleted successfully'
        });

    } catch (error) {
        console.error('Delete food truck error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getAllFoodTrucks,
    getFoodTruckById,
    createFoodTruck,
    updateFoodTruck,
    deleteFoodTruck
};
