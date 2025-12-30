// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = window.location.origin + '/api';

const API_ENDPOINTS = {
    // Auth
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,

    // Food Trucks
    foodTrucks: `${API_BASE_URL}/foodtrucks`,
    foodTruck: (id) => `${API_BASE_URL}/foodtrucks/${id}`,

    // Favorites
    addFavorite: (id) => `${API_BASE_URL}/favorites/${id}`,
    removeFavorite: (id) => `${API_BASE_URL}/favorites/${id}`,
    myFavorites: `${API_BASE_URL}/favorites/my-favorites`
};

const CUISINE_EMOJIS = {
    burger: '🍔',
    tacos: '🌮',
    desserts: '🍰',
    pizza: '🍕',
    asian: '🍜',
    mexican: '🌯',
    italian: '🍝',
    american: '🍗',
    french: '🥖',
    other: '🍽️'
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800';

const ITEMS_PER_PAGE = 6;
