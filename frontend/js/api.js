// ============================================
// API MODULE
// ============================================

class API {
    /**
     * Make authenticated request
     */
    async request(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth token if available
        if (auth.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${auth.getToken()}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;

        } catch (error) {
            throw error;
        }
    }

    // ============================================
    // FOOD TRUCKS
    // ============================================

    /**
     * Get all food trucks with filters
     */
    async getFoodTrucks(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_ENDPOINTS.foodTrucks}${queryString ? '?' + queryString : ''}`;
        return await this.request(url);
    }

    /**
     * Get single food truck by ID
     */
    async getFoodTruck(id) {
        return await this.request(API_ENDPOINTS.foodTruck(id));
    }

    /**
     * Create new food truck
     */
    async createFoodTruck(data) {
        return await this.request(API_ENDPOINTS.foodTrucks, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * Update food truck
     */
    async updateFoodTruck(id, data) {
        return await this.request(API_ENDPOINTS.foodTruck(id), {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * Delete food truck
     */
    async deleteFoodTruck(id) {
        return await this.request(API_ENDPOINTS.foodTruck(id), {
            method: 'DELETE'
        });
    }

    // ============================================
    // FAVORITES
    // ============================================

    /**
     * Add food truck to favorites
     */
    async addFavorite(foodTruckId) {
        return await this.request(API_ENDPOINTS.addFavorite(foodTruckId), {
            method: 'POST'
        });
    }

    /**
     * Remove food truck from favorites
     */
    async removeFavorite(foodTruckId) {
        return await this.request(API_ENDPOINTS.removeFavorite(foodTruckId), {
            method: 'DELETE'
        });
    }

    /**
     * Get user's favorite food trucks
     */
    async getMyFavorites() {
        return await this.request(API_ENDPOINTS.myFavorites);
    }
}

// Create global API instance
const api = new API();
