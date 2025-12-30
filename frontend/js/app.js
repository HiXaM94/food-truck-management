// ============================================
// MAIN APPLICATION
// ============================================

class App {
    constructor() {
        this.currentPage = 1;
        this.currentFilters = {};
        this.init();
    }

    /**
     * Initialize application
     */
    async init() {
        // Update UI based on auth state
        ui.updateAuthUI();

        // Setup event listeners
        this.setupEventListeners();

        // Load initial data
        await this.loadFoodTrucks();

        // If authenticated, verify token
        if (auth.isAuthenticated()) {
            try {
                await auth.getCurrentUser();
                ui.updateAuthUI();
            } catch (error) {
                console.error('Token verification failed:', error);
                ui.showToast('Session expired. Please login again.', 'error');
            }
        }
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.handleNavigation(page);
            });
        });

        // Auth buttons
        document.getElementById('loginBtn').addEventListener('click', () => {
            ui.switchAuthForm('login');
            ui.toggleModal(true);
        });

        document.getElementById('registerBtn').addEventListener('click', () => {
            ui.switchAuthForm('register');
            ui.toggleModal(true);
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Modal controls
        document.getElementById('modalClose').addEventListener('click', () => {
            ui.toggleModal(false);
        });

        document.getElementById('modalOverlay').addEventListener('click', () => {
            ui.toggleModal(false);
        });

        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            ui.switchAuthForm('register');
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            ui.switchAuthForm('login');
        });

        // Auth forms
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            this.handleRegister(e);
        });

        // Search and filters
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Food truck form
        document.getElementById('foodTruckForm').addEventListener('submit', (e) => {
            this.handleFoodTruckSubmit(e);
        });

        document.getElementById('cancelFormBtn').addEventListener('click', () => {
            ui.resetForm();
            ui.navigateTo('home');
        });

        // Event delegation for dynamic elements
        document.addEventListener('click', (e) => {
            // Favorite button
            if (e.target.closest('.favorite-btn')) {
                const btn = e.target.closest('.favorite-btn');
                const id = btn.dataset.id;
                this.handleFavoriteToggle(id, btn);
            }

            // Edit button
            if (e.target.closest('.action-btn-edit')) {
                const btn = e.target.closest('.action-btn-edit');
                const id = btn.dataset.id;
                this.handleEdit(id);
            }

            // Delete button
            if (e.target.closest('.action-btn-delete')) {
                const btn = e.target.closest('.action-btn-delete');
                const id = btn.dataset.id;
                this.handleDelete(id);
            }

            // Pagination
            if (e.target.closest('.page-btn')) {
                const btn = e.target.closest('.page-btn');
                if (!btn.disabled) {
                    const page = parseInt(btn.dataset.page);
                    this.loadFoodTrucks(page);
                }
            }
        });
    }

    /**
     * Handle navigation
     */
    async handleNavigation(page) {
        if (page === 'favorites') {
            if (!auth.isAuthenticated()) {
                ui.showToast('Please login to view favorites', 'error');
                return;
            }
            await this.loadFavorites();
        } else if (page === 'add') {
            if (!auth.isAuthenticated()) {
                ui.showToast('Please login to add food trucks', 'error');
                return;
            }
            ui.resetForm();
        } else if (page === 'home') {
            await this.loadFoodTrucks();
        }

        ui.navigateTo(page);
    }

    /**
     * Handle login
     */
    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await auth.login(email, password);
            ui.toggleModal(false);
            ui.updateAuthUI();
            ui.showToast('Login successful!', 'success');

            // Reload current page
            await this.loadFoodTrucks();

        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    }

    /**
     * Handle register
     */
    async handleRegister(e) {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            await auth.register(username, email, password);
            ui.toggleModal(false);
            ui.updateAuthUI();
            ui.showToast('Registration successful!', 'success');

            // Reload current page
            await this.loadFoodTrucks();

        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    }

    /**
     * Handle logout
     */
    handleLogout() {
        auth.logout();
        ui.updateAuthUI();
        ui.showToast('Logged out successfully', 'success');
        ui.navigateTo('home');
        this.loadFoodTrucks();
    }

    /**
     * Handle search and filters
     */
    async handleSearch() {
        const search = document.getElementById('searchInput').value;
        const cuisine = document.getElementById('cuisineFilter').value;
        const status = document.getElementById('statusFilter').value;

        this.currentFilters = {
            search,
            cuisine,
            status
        };

        await this.loadFoodTrucks(1);
    }

    /**
     * Load food trucks
     */
    async loadFoodTrucks(page = 1) {
        try {
            ui.showLoading('trucksGrid');

            const params = {
                page,
                limit: ITEMS_PER_PAGE,
                ...this.currentFilters
            };

            const response = await api.getFoodTrucks(params);

            ui.renderTrucks(response.data, 'trucksGrid');
            ui.renderPagination(response.pagination);

            // Update results count
            document.getElementById('resultsCount').textContent =
                `${response.pagination.total} food trucks found`;

            this.currentPage = page;

        } catch (error) {
            ui.showToast('Failed to load food trucks', 'error');
            console.error(error);
        }
    }

    /**
     * Load favorites
     */
    async loadFavorites() {
        try {
            ui.showLoading('favoritesGrid');

            const response = await api.getMyFavorites();

            ui.renderTrucks(response.data, 'favoritesGrid');

        } catch (error) {
            ui.showToast('Failed to load favorites', 'error');
            console.error(error);
        }
    }

    /**
     * Handle favorite toggle
     */
    async handleFavoriteToggle(id, btn) {
        if (!auth.isAuthenticated()) {
            ui.showToast('Please login to add favorites', 'error');
            return;
        }

        try {
            const isFavorited = btn.classList.contains('favorited');

            if (isFavorited) {
                await api.removeFavorite(id);
                btn.classList.remove('favorited');
                btn.querySelector('i').className = 'far fa-heart';
                ui.showToast('Removed from favorites', 'success');
            } else {
                await api.addFavorite(id);
                btn.classList.add('favorited');
                btn.querySelector('i').className = 'fas fa-heart';
                ui.showToast('Added to favorites', 'success');
            }

            // Update favorite count
            const card = btn.closest('.truck-card');
            const countElement = card.querySelector('.info-item:has(.fa-heart) span');
            if (countElement) {
                const currentCount = parseInt(countElement.textContent);
                const newCount = isFavorited ? currentCount - 1 : currentCount + 1;
                countElement.textContent = `${newCount} favorites`;
            }

        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    }

    /**
     * Handle edit
     */
    async handleEdit(id) {
        try {
            const response = await api.getFoodTruck(id);
            ui.populateForm(response.data);
            ui.navigateTo('add');

        } catch (error) {
            ui.showToast('Failed to load food truck', 'error');
        }
    }

    /**
     * Handle delete
     */
    async handleDelete(id) {
        if (!confirm('Are you sure you want to delete this food truck?')) {
            return;
        }

        try {
            await api.deleteFoodTruck(id);
            ui.showToast('Food truck deleted successfully', 'success');
            await this.loadFoodTrucks(this.currentPage);

        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    }

    /**
     * Handle food truck form submit
     */
    async handleFoodTruckSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('truckId').value;
        const data = {
            name: document.getElementById('truckName').value,
            cuisine: document.getElementById('truckCuisine').value,
            city: document.getElementById('truckCity').value,
            current_location: document.getElementById('truckLocation').value,
            average_price: document.getElementById('truckPrice').value || null,
            operating_hours: document.getElementById('truckHours').value,
            status: document.getElementById('truckStatus').value,
            image: document.getElementById('truckImage').value,
            menu: document.getElementById('truckMenu').value
        };

        try {
            if (id) {
                // Update existing
                await api.updateFoodTruck(id, data);
                ui.showToast('Food truck updated successfully', 'success');
            } else {
                // Create new
                await api.createFoodTruck(data);
                ui.showToast('Food truck created successfully', 'success');
            }

            ui.resetForm();
            ui.navigateTo('home');
            await this.loadFoodTrucks();

        } catch (error) {
            ui.showToast(error.message, 'error');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
