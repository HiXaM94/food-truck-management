// PWA Installation and Service Worker Registration
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }

        // Handle install prompt
        this.setupInstallPrompt();

        // Check if already installed
        this.checkIfInstalled();
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/'
            });

            console.log('[PWA] Service Worker registered successfully:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('[PWA] New Service Worker found');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker available
                        this.showUpdateNotification();
                    }
                });
            });

        } catch (error) {
            console.error('[PWA] Service Worker registration failed:', error);
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();

            // Save the event for later use
            this.deferredPrompt = e;

            // Show custom install button
            this.showInstallButton();

            console.log('[PWA] Install prompt ready');
        });

        // Handle app installed event
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            this.deferredPrompt = null;
            this.hideInstallButton();
            this.showToast('App installed successfully! 🎉');
        });
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            console.log('[PWA] Install prompt not available');
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user's response
        const { outcome } = await this.deferredPrompt.userChoice;

        console.log(`[PWA] User response: ${outcome}`);

        if (outcome === 'accepted') {
            this.showToast('Installing app... 📱');
        }

        // Clear the deferredPrompt
        this.deferredPrompt = null;
    }

    showInstallButton() {
        // Create install button if it doesn't exist
        let installBtn = document.getElementById('pwa-install-btn');

        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'pwa-install-button';
            installBtn.innerHTML = `
                <i class="fas fa-download"></i>
                <span>Install App</span>
            `;
            installBtn.addEventListener('click', () => this.promptInstall());

            // Add to navbar or create a floating button
            const navbar = document.querySelector('.navbar .container');
            if (navbar) {
                navbar.appendChild(installBtn);
            }
        }

        installBtn.style.display = 'flex';
    }

    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    checkIfInstalled() {
        // Check if running as installed PWA
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            console.log('[PWA] Running as installed app');
            this.hideInstallButton();
            return true;
        }
        return false;
    }

    showUpdateNotification() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'pwa-update-banner';
        updateBanner.innerHTML = `
            <div class="pwa-update-content">
                <i class="fas fa-sync-alt"></i>
                <span>New version available!</span>
                <button onclick="window.location.reload()" class="btn btn-primary btn-sm">
                    Update Now
                </button>
            </div>
        `;
        document.body.appendChild(updateBanner);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            updateBanner.remove();
        }, 10000);
    }

    showToast(message) {
        // Use existing toast system if available, otherwise create simple toast
        if (window.showToast) {
            window.showToast(message, 'success');
        } else {
            const toast = document.createElement('div');
            toast.className = 'pwa-toast';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('show');
            }, 100);

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                console.log('[PWA] Notification permission granted');
                return true;
            } else {
                console.log('[PWA] Notification permission denied');
                return false;
            }
        }
        return false;
    }

    // Subscribe to push notifications
    async subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    'YOUR_PUBLIC_VAPID_KEY_HERE' // Replace with your VAPID public key
                )
            });

            console.log('[PWA] Push subscription:', subscription);

            // Send subscription to your server
            await this.sendSubscriptionToServer(subscription);

            return subscription;
        } catch (error) {
            console.error('[PWA] Push subscription failed:', error);
            return null;
        }
    }

    async sendSubscriptionToServer(subscription) {
        // Send to your backend
        try {
            const response = await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription)
            });

            if (response.ok) {
                console.log('[PWA] Subscription sent to server');
            }
        } catch (error) {
            console.error('[PWA] Failed to send subscription:', error);
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Initialize PWA when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pwaInstaller = new PWAInstaller();
    });
} else {
    window.pwaInstaller = new PWAInstaller();
}

// Add PWA-specific styles
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
    .pwa-install-button {
        display: none;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        background: linear-gradient(135deg, #0066FF 0%, #00D4AA 100%);
        color: white;
        border: none;
        border-radius: 100px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
    }

    .pwa-install-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 102, 255, 0.4);
    }

    .pwa-update-banner {
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        animation: slideDown 0.3s ease;
    }

    .pwa-update-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .pwa-update-content i {
        color: #0066FF;
        font-size: 1.25rem;
    }

    .pwa-toast {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 100px;
        font-weight: 500;
        z-index: 2000;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .pwa-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        .pwa-install-button {
            bottom: 1rem;
            right: 1rem;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }
    }
`;
document.head.appendChild(pwaStyles);
