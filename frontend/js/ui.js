// ============================================
// UI MODULE
// ============================================

class UI {
    /**
     * Show toast notification
     */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        const icon = toast.querySelector('i');

        // Set message
        toastMessage.textContent = message;

        // Set icon based on type
        icon.className = '';
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
        } else if (type === 'info') {
            icon.className = 'fas fa-info-circle';
        }

        // Add type class
        toast.className = `toast ${type}`;

        // Show toast
        toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Show/hide modal
     */
    toggleModal(show = true) {
        const modal = document.getElementById('authModal');
        if (show) {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }

    /**
     * Switch between login and register forms
     */
    switchAuthForm(formType) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (formType === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    /**
     * Update UI based on auth state
     */
    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const authRequired = document.querySelectorAll('.auth-required');

        if (auth.isAuthenticated()) {
            // Hide auth buttons, show user menu
            authButtons.style.display = 'none';
            userMenu.style.display = 'block';

            // Show auth-required elements
            authRequired.forEach(el => el.style.display = 'flex');

            // Update user info
            const user = auth.getUser();
            document.getElementById('userName').textContent = user.username;
            document.getElementById('userEmail').textContent = user.email;

        } else {
            // Show auth buttons, hide user menu
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';

            // Hide auth-required elements
            authRequired.forEach(el => el.style.display = 'none');
        }
    }

    /**
     * Navigate to page
     */
    navigateTo(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageName}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            }
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Render food truck card
     */
    createTruckCard(truck) {
        const card = document.createElement('div');
        card.className = 'truck-card';
        card.dataset.id = truck.id;

        const isOwner = auth.isAuthenticated() && auth.getUser().id === truck.created_by;
        const isFavorited = truck.is_favorited || false;

        // Generate rating stars
        const rating = truck.rating || 0;
        const reviewsCount = truck.reviews_count || 0;
        const starsHTML = this.generateStars(rating);

        card.innerHTML = `
            <div class="truck-image">
                <img src="${truck.image || DEFAULT_IMAGE}" alt="${truck.name}" 
                     onerror="this.src='${DEFAULT_IMAGE}'">
                <span class="truck-status ${truck.status}">${truck.status}</span>
                ${auth.isAuthenticated() ? `
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                            data-id="${truck.id}">
                        <i class="fa${isFavorited ? 's' : 'r'} fa-heart"></i>
                    </button>
                ` : ''}
            </div>
            <div class="truck-content">
                <div class="truck-header">
                    <h3 class="truck-name">${truck.name}</h3>
                    <span class="truck-cuisine">${CUISINE_EMOJIS[truck.cuisine] || '🍽️'} ${truck.cuisine}</span>
                    ${rating > 0 ? `
                        <div class="truck-rating">
                            <div class="stars">${starsHTML}</div>
                            <span class="rating-text">${rating.toFixed(1)} (${reviewsCount} reviews)</span>
                        </div>
                    ` : ''}
                </div>
                <div class="truck-info">
                    <div class="info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${truck.city}${truck.current_location ? ', ' + truck.current_location : ''}</span>
                    </div>
                    ${truck.average_price ? `
                        <div class="info-item">
                            <i class="fas fa-euro-sign"></i>
                            <span>€${parseFloat(truck.average_price).toFixed(2)} avg</span>
                        </div>
                    ` : ''}
                    ${truck.operating_hours ? `
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>${truck.operating_hours}</span>
                        </div>
                    ` : ''}
                    <div class="info-item">
                        <i class="fas fa-heart"></i>
                        <span>${truck.favorite_count || 0} favorites</span>
                    </div>
                </div>
                ${isOwner ? `
                    <div class="truck-actions">
                        <button class="action-btn action-btn-edit" data-id="${truck.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn action-btn-delete" data-id="${truck.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    /**
     * Generate star rating HTML
     */
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }

        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return starsHTML;
    }

    /**
     * Render food trucks grid
     */
    renderTrucks(trucks, containerId) {
        const container = document.getElementById(containerId);

        if (trucks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-truck"></i>
                    <h3>No food trucks found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        trucks.forEach(truck => {
            const card = this.createTruckCard(truck);
            container.appendChild(card);
        });
    }

    /**
     * Render pagination
     */
    renderPagination(pagination) {
        const container = document.getElementById('pagination');

        if (!pagination || pagination.totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const { page, totalPages } = pagination;
        let html = '';

        // Previous button
        html += `
            <button class="page-btn" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= page - 1 && i <= page + 1)
            ) {
                html += `
                    <button class="page-btn ${i === page ? 'active' : ''}" 
                            data-page="${i}">${i}</button>
                `;
            } else if (i === page - 2 || i === page + 2) {
                html += '<span>...</span>';
            }
        }

        // Next button
        html += `
            <button class="page-btn" data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        container.innerHTML = html;
    }

    /**
     * Show loading state
     */
    showLoading(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;
    }

    /**
     * Populate form with truck data (for editing)
     */
    populateForm(truck) {
        document.getElementById('truckId').value = truck.id;
        document.getElementById('truckName').value = truck.name;
        document.getElementById('truckCuisine').value = truck.cuisine;
        document.getElementById('truckCity').value = truck.city;
        document.getElementById('truckLocation').value = truck.current_location || '';
        document.getElementById('truckPrice').value = truck.average_price || '';
        document.getElementById('truckHours').value = truck.operating_hours || '';
        document.getElementById('truckStatus').value = truck.status;
        document.getElementById('truckImage').value = truck.image || '';
        document.getElementById('truckMenu').value = truck.menu || '';

        // Update form title
        document.getElementById('formTitle').innerHTML = `
            <i class="fas fa-edit"></i>
            Edit Food Truck
        `;
        document.getElementById('submitBtnText').textContent = 'Update Food Truck';
    }

    /**
     * Reset form
     */
    resetForm() {
        document.getElementById('foodTruckForm').reset();
        document.getElementById('truckId').value = '';

        // Reset form title
        document.getElementById('formTitle').innerHTML = `
            <i class="fas fa-plus-circle"></i>
            Add New Food Truck
        `;
        document.getElementById('submitBtnText').textContent = 'Add Food Truck';
    }
}

// Create global UI instance
const ui = new UI();
