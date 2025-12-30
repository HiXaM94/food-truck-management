// ============================================
// AUTHENTICATION MODULE
// ============================================

class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Get current user
     */
    getUser() {
        return this.user;
    }

    /**
     * Get auth token
     */
    getToken() {
        return this.token;
    }

    /**
     * Set authentication data
     */
    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Clear authentication data
     */
    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    /**
     * Register new user
     */
    async register(username, email, password) {
        try {
            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            this.setAuth(data.token, data.user);
            return data;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            const response = await fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            this.setAuth(data.token, data.user);
            return data;

        } catch (error) {
            throw error;
        }
    }

    /**
     * Logout user
     */
    logout() {
        this.clearAuth();
    }

    /**
     * Get current user from server
     */
    async getCurrentUser() {
        try {
            const response = await fetch(API_ENDPOINTS.me, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get user');
            }

            this.user = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;

        } catch (error) {
            // Token might be invalid, clear auth
            this.clearAuth();
            throw error;
        }
    }
}

// Create global auth instance
const auth = new Auth();
