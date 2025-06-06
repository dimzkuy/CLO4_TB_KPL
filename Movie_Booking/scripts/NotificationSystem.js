/**
 * NotificationSystem - Modular notification system
 * Handles all notification types with consistent styling
 */
class NotificationSystem {
    constructor() {
        this.activeNotifications = new Set();
        this.defaultDuration = 3000;
        this.maxNotifications = 5;
        
        // Ensure CSS is loaded
        this.loadNotificationCSS();
    }

    /**
     * Load notification CSS if not already loaded
     */
    loadNotificationCSS() {
        if (!document.querySelector('#notification-css')) {
            const link = document.createElement('link');
            link.id = 'notification-css';
            link.rel = 'stylesheet';
            link.href = '../styles/notification.css';
            document.head.appendChild(link);
        }
    }

    /**
     * Show success notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    showSuccess(message, duration = this.defaultDuration) {
        return this.createNotification(message, 'success', duration);
    }

    /**
     * Show error notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    showError(message, duration = this.defaultDuration) {
        return this.createNotification(message, 'error', duration);
    }

    /**
     * Show warning notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    showWarning(message, duration = this.defaultDuration) {
        return this.createNotification(message, 'warning', duration);
    }

    /**
     * Show info notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    showInfo(message, duration = this.defaultDuration) {
        return this.createNotification(message, 'info', duration);
    }

    /**
     * Create and display notification
     * @param {string} message - Message to display
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     * @returns {HTMLElement} - Notification element
     */
    createNotification(message, type = 'success', duration = this.defaultDuration) {
        // Limit number of notifications
        if (this.activeNotifications.size >= this.maxNotifications) {
            this.removeOldestNotification();
        }

        // Create notification element
        const notification = document.createElement('div');
        const notificationId = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        notification.id = notificationId;
        
        // Set classes
        notification.className = `custom-success-notification notification-${type}`;
        
        // Create notification content
        notification.innerHTML = this.createNotificationHTML(message, notificationId);
        
        // Add to DOM
        document.body.appendChild(notification);
        this.activeNotifications.add(notification);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }
        
        // Add event listeners
        this.attachEventListeners(notification);
        
        return notification;
    }

    /**
     * Create notification HTML content
     * @param {string} message - Message to display
     * @param {string} notificationId - Unique notification ID
     * @returns {string} - HTML string
     */
    createNotificationHTML(message, notificationId) {
        return `
            <span class="notification-message">${this.escapeHtml(message)}</span>
            <button class="notification-close-btn" data-notification-id="${notificationId}" aria-label="Close notification">
                ×
            </button>
        `;
    }

    /**
     * Attach event listeners to notification
     * @param {HTMLElement} notification - Notification element
     */
    attachEventListeners(notification) {
        const closeBtn = notification.querySelector('.notification-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.removeNotification(notification);
            });
        }
        
        // Close on Escape key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                this.removeNotification(notification);
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
    }

    /**
     * Remove notification with animation
     * @param {HTMLElement} notification - Notification element to remove
     */
    removeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        // Add exit animation
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
                this.activeNotifications.delete(notification);
            }
        }, 300);
    }

    /**
     * Remove oldest notification when limit is reached
     */
    removeOldestNotification() {
        const oldestNotification = this.activeNotifications.values().next().value;
        if (oldestNotification) {
            this.removeNotification(oldestNotification);
        }
    }

    /**
     * Remove all active notifications
     */
    clearAll() {
        const notifications = Array.from(this.activeNotifications);
        notifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get count of active notifications
     * @returns {number} - Number of active notifications
     */
    getActiveCount() {
        return this.activeNotifications.size;
    }

    /**
     * Check if notifications are supported
     * @returns {boolean} - True if supported
     */
    isSupported() {
        return typeof document !== 'undefined' && document.createElement;
    }
}

// Create singleton instance
const notificationSystem = new NotificationSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}

// Global functions for backward compatibility
window.showCustomSuccessNotification = function(message, duration) {
    return notificationSystem.showSuccess(message, duration);
};

window.showCustomErrorNotification = function(message, duration) {
    return notificationSystem.showError(message, duration);
};

window.showCustomWarningNotification = function(message, duration) {
    return notificationSystem.showWarning(message, duration);
};

window.showCustomInfoNotification = function(message, duration) {
    return notificationSystem.showInfo(message, duration);
};

// Export singleton instance
window.NotificationSystem = notificationSystem;