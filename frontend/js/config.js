// ============================================
// CONFIGURATION
// ============================================

const isNative = window.Capacitor && window.Capacitor.isNative;
// Check if running in Electron (via user agent or window property)
const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;

// Determine API Base URL
let API_BASE_URL;

if (isNative) {
    // For Android Emulator, use 10.0.2.2. For real device, use your machine's LAN IP (e.g. http://192.168.1.X:3000)
    // REPLACE THIS WITH YOUR REAL BACKEND URL FOR PRODUCTION
    API_BASE_URL = 'http://10.0.2.2:3000/api';
} else if (isElectron) {
    // Electron runs the server locally on localhost:3000 (as we set in main.js)
    API_BASE_URL = 'http://localhost:3000/api';
} else {
    // Web Browser
    API_BASE_URL = window.location.origin + '/api';
}

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
