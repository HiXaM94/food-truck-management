const { query } = require('../config/database');

/**
 * Ingest food trucks from n8n or external source
 * POST /api/ingest/foodtrucks
 * Body: { trucks: [ ... ] }
 */
const ingestFoodTrucks = async (req, res) => {
    try {
        const { trucks } = req.body;

        if (!trucks || !Array.isArray(trucks) || trucks.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No trucks provided or invalid format. Expected { trucks: [] }'
            });
        }

        let inserted = 0;
        let updated = 0;
        let errors = 0;

        // Default admin ID for system created entries
        const SYSTEM_USER_ID = 1;

        for (const truck of trucks) {
            try {
                // Map Google Maps data fields to our schema
                // Logic depends on what n8n sends, assuming mapped fields:
                // name, cuisine, city, address (-> current_location), rating/price_level (-> average_price), etc.
                const {
                    name,
                    cuisine = 'other',
                    city,
                    address,
                    price_level,
                    operating_hours,
                    image
                } = truck;

                if (!name || !city) {
                    console.warn('Skipping truck without name or city:', truck);
                    errors++;
                    continue;
                }

                // Check if exists
                const existing = await query(
                    'SELECT id FROM food_trucks WHERE name = $1 AND city = $2',
                    [name, city]
                );

                if (existing.rows.length > 0) {
                    // Update
                    await query(
                        `UPDATE food_trucks SET 
                        current_location = $1, 
                        average_price = $2, 
                        operating_hours = $3, 
                        image = COALESCE($4, image),
                        cuisine = COALESCE($5, cuisine),
                        updated_at = NOW()
                        WHERE id = $6`,
                        [address, price_level, operating_hours, image, cuisine, existing.rows[0].id]
                    );
                    updated++;
                } else {
                    // Insert
                    await query(
                        `INSERT INTO food_trucks 
                        (name, cuisine, city, current_location, average_price, operating_hours, image, created_by)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [name, cuisine, city, address, price_level, operating_hours, image, SYSTEM_USER_ID]
                    );
                    inserted++;
                }
            } catch (err) {
                console.error('Error processing truck:', truck.name, err);
                errors++;
            }
        }

        res.json({
            success: true,
            message: 'Ingestion complete',
            stats: {
                total: trucks.length,
                inserted,
                updated,
                errors
            }
        });

    } catch (error) {
        console.error('Ingest error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during ingestion'
        });
    }
};

module.exports = {
    ingestFoodTrucks
};
