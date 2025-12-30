// ============================================
// GOOGLE MAPS SCRAPER MODULE
// ============================================

class GoogleMapsScraper {
    constructor() {
        this.apiEndpoint = `${API_BASE_URL}/scraper`;
    }

    /**
     * Scrape food truck data from Google Maps
     */
    async scrapePlaces(query, limit = 10, radius = 5) {
        try {
            const response = await fetch(`${this.apiEndpoint}/google-maps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify({
                    query,
                    limit,
                    radius
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to scrape data');
            }

            return await response.json();
        } catch (error) {
            console.error('Scraping error:', error);
            throw error;
        }
    }

    /**
     * Parse scraped data and convert to food truck format
     */
    parseScrapedData(places) {
        return places.map(place => ({
            name: place.name || 'Unknown',
            cuisine: this.detectCuisine(place.name, place.types),
            city: this.extractCity(place.address),
            current_location: place.address || '',
            average_price: this.estimatePrice(place.priceLevel),
            operating_hours: this.formatHours(place.openingHours),
            status: place.isOpen ? 'active' : 'inactive',
            image: place.photos && place.photos.length > 0 ? place.photos[0] : '',
            menu: JSON.stringify({
                items: place.menu || [],
                description: place.description || ''
            }),
            rating: place.rating || 0,
            reviews_count: place.userRatingsTotal || 0,
            phone: place.phoneNumber || '',
            website: place.website || '',
            latitude: place.geometry?.location?.lat || null,
            longitude: place.geometry?.location?.lng || null
        }));
    }

    /**
     * Detect cuisine type from name and types
     */
    detectCuisine(name, types = []) {
        const cuisineKeywords = {
            burger: ['burger', 'hamburger', 'grill'],
            tacos: ['taco', 'mexican', 'burrito'],
            pizza: ['pizza', 'pizzeria'],
            asian: ['asian', 'chinese', 'thai', 'vietnamese', 'sushi', 'ramen'],
            italian: ['italian', 'pasta', 'trattoria'],
            french: ['french', 'boulangerie', 'patisserie', 'crepe'],
            american: ['american', 'bbq', 'barbecue', 'diner'],
            desserts: ['dessert', 'ice cream', 'gelato', 'bakery', 'cake']
        };

        const lowerName = name.toLowerCase();
        const lowerTypes = types.map(t => t.toLowerCase()).join(' ');
        const searchText = `${lowerName} ${lowerTypes}`;

        for (const [cuisine, keywords] of Object.entries(cuisineKeywords)) {
            if (keywords.some(keyword => searchText.includes(keyword))) {
                return cuisine;
            }
        }

        return 'other';
    }

    /**
     * Extract city from address
     */
    extractCity(address) {
        if (!address) return '';

        // Try to extract city from address
        const parts = address.split(',');
        if (parts.length >= 2) {
            return parts[parts.length - 2].trim();
        }

        return parts[0].trim();
    }

    /**
     * Estimate price from price level
     */
    estimatePrice(priceLevel) {
        const priceMap = {
            0: 5,
            1: 8,
            2: 12,
            3: 18,
            4: 25
        };

        return priceMap[priceLevel] || 10;
    }

    /**
     * Format opening hours
     */
    formatHours(openingHours) {
        if (!openingHours || !openingHours.weekdayText) {
            return 'Hours not available';
        }

        return openingHours.weekdayText.join(', ');
    }

    /**
     * Import scraped data to database
     */
    async importScrapedData(data) {
        const results = {
            success: [],
            failed: []
        };

        for (const truck of data) {
            try {
                const response = await api.createFoodTruck(truck);
                results.success.push(response.data);
            } catch (error) {
                results.failed.push({
                    truck,
                    error: error.message
                });
            }
        }

        return results;
    }
}

// Create global instance
const scraper = new GoogleMapsScraper();
