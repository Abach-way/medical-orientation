/**
 * Mobile PWA Module - Progressive Web App Functionality
 * Service Worker, Offline Support, Push Notifications
 */

class MobilePWA {
    constructor() {
        this.swRegistration = null;
        this.isOnline = navigator.onLine;
        this.initialize();
    }

    /**
     * Initialize PWA features
     */
    async initialize() {
        // Register service worker
        await this.registerServiceWorker();
        
        // Setup online/offline listeners
        this.setupNetworkListeners();
        
        // Setup install prompt
        this.setupInstallPrompt();
        
        // Setup touch gestures
        this.setupTouchGestures();
        
        // Apply mobile-first styles
        this.applyMobileOptimizations();
    }

    /**
     * Register service worker
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered successfully');
                
                // Check for updates
                this.swRegistration.addEventListener('updatefound', () => {
                    const newWorker = this.swRegistration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Setup network status listeners
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNetworkStatus('Подключение к интернету восстановлено', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNetworkStatus('Нет подключения к интернету. Работа в оффлайн-режиме', 'warning');
        });
    }

    /**
     * Setup install prompt
     */
    setupInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton(deferredPrompt);
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            deferredPrompt = null;
        });
    }

    /**
     * Show install button
     */
    showInstallButton(deferredPrompt) {
        const installBtn = document.createElement('button');
        installBtn.className = 'install-pwa-btn';
        installBtn.innerHTML = '📱 Установить приложение';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 25px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            cursor: pointer;
            z-index: 1000;
            animation: pulse 2s infinite;
        `;

        installBtn.addEventListener('click', async () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to install prompt: ${outcome}`);
        });

        document.body.appendChild(installBtn);
    }

    /**
     * Setup touch gestures
     */
    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleGesture(touchStartX, touchEndX, touchStartY, touchEndY);
        }, false);
    }

    /**
     * Handle swipe gestures
     */
    handleGesture(startX, endX, startY, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;
        const threshold = 50;

        // Horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                this.onSwipeRight();
            } else {
                this.onSwipeLeft();
            }
        }
        
        // Vertical swipe
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > threshold) {
            if (diffY > 0) {
                this.onSwipeDown();
            } else {
                this.onSwipeUp();
            }
        }
    }

    /**
     * Swipe gesture handlers
     */
    onSwipeRight() {
        // Navigate back or previous
        console.log('Swipe right detected');
        const event = new CustomEvent('swipeRight');
        document.dispatchEvent(event);
    }

    onSwipeLeft() {
        // Navigate forward or next
        console.log('Swipe left detected');
        const event = new CustomEvent('swipeLeft');
        document.dispatchEvent(event);
    }

    onSwipeDown() {
        // Refresh content
        console.log('Swipe down detected');
        const event = new CustomEvent('swipeDown');
        document.dispatchEvent(event);
    }

    onSwipeUp() {
        // Show more options
        console.log('Swipe up detected');
        const event = new CustomEvent('swipeUp');
        document.dispatchEvent(event);
    }

    /**
     * Request push notification permission
     */
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
            console.log('Notification permission granted');
            await this.subscribeToPushNotifications();
            return true;
        } else {
            console.log('Notification permission denied');
            return false;
        }
    }

    /**
     * Subscribe to push notifications
     */
    async subscribeToPushNotifications() {
        if (!this.swRegistration) {
            console.error('Service Worker not registered');
            return;
        }

        try {
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    'YOUR_VAPID_PUBLIC_KEY' // Replace with actual VAPID key
                )
            });

            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
            console.log('Push subscription successful');
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
        }
    }

    /**
     * Send subscription to server
     */
    async sendSubscriptionToServer(subscription) {
        // Send to backend API
        try {
            await fetch('/api/push-subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription)
            });
        } catch (error) {
            console.error('Failed to send subscription to server:', error);
        }
    }

    /**
     * Show local notification
     */
    showNotification(title, options = {}) {
        if (!('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/icon-192x192.png',
                badge: '/badge-72x72.png',
                ...options
            });

            notification.onclick = (event) => {
                event.preventDefault();
                window.focus();
                notification.close();
            };
        }
    }

    /**
     * Apply mobile optimizations
     */
    applyMobileOptimizations() {
        // Disable pull-to-refresh on mobile
        document.body.style.overscrollBehavior = 'contain';
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add viewport meta if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        }
    }

    /**
     * Sync offline data when online
     */
    async syncOfflineData() {
        const offlineData = this.getOfflineData();
        
        if (offlineData.length === 0) {
            return;
        }

        console.log('Syncing offline data...');
        
        for (const item of offlineData) {
            try {
                await fetch(item.url, {
                    method: item.method,
                    headers: item.headers,
                    body: item.body
                });
                
                this.removeFromOfflineQueue(item.id);
            } catch (error) {
                console.error('Failed to sync item:', error);
            }
        }
    }

    /**
     * Save data for offline sync
     */
    saveForOfflineSync(data) {
        const offlineQueue = this.getOfflineData();
        offlineQueue.push({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...data
        });
        localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
    }

    /**
     * Get offline data queue
     */
    getOfflineData() {
        const data = localStorage.getItem('offlineQueue');
        return data ? JSON.parse(data) : [];
    }

    /**
     * Remove item from offline queue
     */
    removeFromOfflineQueue(id) {
        const queue = this.getOfflineData();
        const updated = queue.filter(item => item.id !== id);
        localStorage.setItem('offlineQueue', JSON.stringify(updated));
    }

    /**
     * Show network status notification
     */
    showNetworkStatus(message, type) {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(message);
        }
    }

    /**
     * Show update notification
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-message">
                <p>Доступна новая версия приложения!</p>
                <button onclick="window.location.reload()" class="update-btn">Обновить</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(notification);
    }

    /**
     * Convert VAPID key
     */
    urlBase64ToUint8Array(base64String) {
        // TODO: Replace with actual VAPID key from environment variables
        // Example: const vapidKey = process.env.VAPID_PUBLIC_KEY || 'YOUR_VAPID_PUBLIC_KEY';
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

    /**
     * Check if app is installed
     */
    isAppInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    /**
     * Get device info
     */
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            online: navigator.onLine,
            cookieEnabled: navigator.cookieEnabled,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobilePWA;
}
