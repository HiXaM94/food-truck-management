// ============================================
// CONFIGURATION
// ============================================

const API_BASE_URL = window.location.origin + '/api';
const N8N_WEBHOOK_URL = 'https://n8n.zackdev.io/webhook/chat';

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

// Use local optimized images for better performance
const DEFAULT_IMAGE = '/images/food-truck-burger.png';

// Cuisine-specific placeholder images
const CUISINE_IMAGES = {
    burger: '/images/food-truck-burger.png',
    tacos: '/images/food-truck-tacos.png',
    mexican: '/images/food-truck-tacos.png',
    desserts: '/images/food-truck-dessert.png',
    default: '/images/food-truck-burger.png'
};

const ITEMS_PER_PAGE = 6;

// Performance optimization: Enable lazy loading for images
const ENABLE_LAZY_LOADING = true;
