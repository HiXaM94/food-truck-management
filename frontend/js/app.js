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

        // Scraper form
        const scraperForm = document.getElementById('scraperForm');
        if (scraperForm) {
            scraperForm.addEventListener('submit', (e) => {
                this.handleScraperSubmit(e);
            });
        }

        // Leads form
        const leadsForm = document.getElementById('leadsForm');
        if (leadsForm) {
            leadsForm.addEventListener('submit', (e) => {
                this.handleLeadsSubmit(e);
            });
        }

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

            // Update stats
            this.updateStats(response.pagination.total);

        } catch (error) {
            ui.showToast('Failed to load food trucks', 'error');
            console.error(error);
        }
    }

    /**
     * Update hero stats
     */
    updateStats(totalTrucks) {
        document.getElementById('totalTrucks').textContent = totalTrucks || 0;
        // You can add more dynamic stats here
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

    /**
     * Handle Google Maps scraper submit
     */
    async handleScraperSubmit(e) {
        e.preventDefault();

        const query = document.getElementById('scraperQuery').value;
        const limit = parseInt(document.getElementById('scraperLimit').value) || 10;
        const radius = parseInt(document.getElementById('scraperRadius').value) || 5;

        try {
            ui.showToast('Starting scraper... This may take a moment.', 'info');

            // Scrape data from Google Maps
            const response = await scraper.scrapePlaces(query, limit, radius);

            if (!response.data || response.data.length === 0) {
                ui.showToast('No results found for this query', 'warning');
                return;
            }

            // Parse scraped data
            const parsedData = scraper.parseScrapedData(response.data);

            // Display results
            const resultsContainer = document.getElementById('scraperResults');
            const resultsContent = document.getElementById('scraperResultsContent');

            resultsContainer.style.display = 'block';
            resultsContent.innerHTML = `
                <div style="background: var(--gray-50); padding: 1rem; border-radius: var(--radius-lg); margin-bottom: 1rem;">
                    <p><strong>Found ${parsedData.length} food trucks</strong></p>
                    <p style="color: var(--gray-600); font-size: 0.875rem;">Review the results below and click "Import All" to add them to your database.</p>
                </div>
                <div style="max-height: 400px; overflow-y: auto; margin-bottom: 1rem;">
                    ${parsedData.map((truck, index) => `
                        <div style="background: var(--white); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 0.5rem; border: 1px solid var(--gray-200);">
                            <strong>${index + 1}. ${truck.name}</strong>
                            <div style="color: var(--gray-600); font-size: 0.875rem; margin-top: 0.25rem;">
                                ${truck.cuisine} • ${truck.city} • ${truck.status}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn btn-primary btn-block" id="importScrapedBtn">
                    <i class="fas fa-download"></i>
                    Import All to Database
                </button>
            `;

            // Add import button handler
            document.getElementById('importScrapedBtn').addEventListener('click', async () => {
                try {
                    ui.showToast('Importing scraped data...', 'info');
                    const importResults = await scraper.importScrapedData(parsedData);

                    ui.showToast(
                        `Successfully imported ${importResults.success.length} food trucks!`,
                        'success'
                    );

                    if (importResults.failed.length > 0) {
                        console.error('Failed imports:', importResults.failed);
                        ui.showToast(
                            `${importResults.failed.length} items failed to import`,
                            'warning'
                        );
                    }

                    // Reset form and navigate home
                    document.getElementById('scraperForm').reset();
                    resultsContainer.style.display = 'none';
                    ui.navigateTo('home');
                    await this.loadFoodTrucks();

                } catch (error) {
                    ui.showToast('Failed to import data: ' + error.message, 'error');
                }
            });

            ui.showToast('Scraping completed successfully!', 'success');

        } catch (error) {
            console.error('Scraper error:', error);
            ui.showToast(error.message || 'Failed to scrape data', 'error');
        }
    }

    /**
     * Handle Lead Generation Submit (N8N)
     */
    async handleLeadsSubmit(e) {
        e.preventDefault();

        const searchQuery = document.getElementById('leadQuery').value;
        const location = document.getElementById('leadLocation').value;
        const limit = parseInt(document.getElementById('leadLimit').value);
        const spreadsheetId = document.getElementById('spreadsheetId').value;

        try {
            ui.showToast('Starting Lead Generation Automation...', 'info');

            const resultsContainer = document.getElementById('leadsResults');
            const resultsContent = document.getElementById('leadsStatusContent');

            resultsContainer.style.display = 'block';
            resultsContent.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-cog fa-spin fa-3x" style="color: var(--primary);"></i>
                    <p style="margin-top: 1rem; font-weight: 500;">Initializing automation...</p>
                </div>
            `;

            // Trigger the backend endpoint which calls N8N
            const response = await api.request('/api/n8n/trigger-lead-generation', {
                method: 'POST',
                body: JSON.stringify({
                    searchQuery,
                    location,
                    limit,
                    spreadsheetId
                })
            });

            if (response.success) {
                ui.showToast('Automation started successfully!', 'success');

                resultsContent.innerHTML = `
                    <div style="background: rgba(30, 35, 50, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); padding: 1.5rem; border-radius: var(--radius-lg); text-align: center; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <i class="fas fa-check-circle" style="color: var(--teal); font-size: 3rem; margin-bottom: 1rem;"></i>
                        <h4 style="color: var(--white); margin-bottom: 0.5rem;">Workflow Active</h4>
                        <p style="color: var(--gray-300); margin-bottom: 1.5rem;">
                            Your automated lead generation for <strong>"${searchQuery} in ${location}"</strong> has started.
                        </p>
                        
                        <div style="text-align: left; background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 1rem;">
                            <p style="color: var(--white);"><strong>Workflow ID:</strong> ${response.data.workflowId}</p>
                            <p style="color: var(--white);"><strong>Status:</strong> <span style="color: var(--primary);">${response.data.status}</span></p>
                            <p style="color: var(--white);"><strong>Estimated Time:</strong> ${response.data.estimatedTime}</p>
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem; justify-content: center;">
                            <button class="btn btn-secondary btn-sm" onclick="ui.showToast('Status check not yet connected to live N8N instance', 'info')">
                                <i class="fas fa-sync-alt"></i> Refresh Status
                            </button>
                            ${spreadsheetId ? `
                                <a href="https://docs.google.com/spreadsheets/d/${spreadsheetId}" target="_blank" class="btn btn-primary btn-sm">
                                    <i class="fas fa-external-link-alt"></i> Open Google Sheet
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `;
            } else {
                throw new Error(response.message || 'Failed to start automation');
            }

        } catch (error) {
            console.error('Lead generation error:', error);
            ui.showToast(error.message, 'error');

            document.getElementById('leadsStatusContent').innerHTML = `
                <div style="text-align: center; color: var(--coral);">
                    <i class="fas fa-exclamation-triangle fa-2x"></i>
                    <p style="margin-top: 0.5rem;">Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
