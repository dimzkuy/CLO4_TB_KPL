// Singleton untuk mengelola notifikasi/alert
class NotificationManager {
    constructor() {
        if (NotificationManager.instance) {
            return NotificationManager.instance;
        }
        
        this.notifications = [];
        this.maxNotifications = 5;
        
        NotificationManager.instance = this;
        return this;
    }
    
    static getInstance() {
        if (!NotificationManager.instance) {
            NotificationManager.instance = new NotificationManager();
        }
        return NotificationManager.instance;
    }
    
    // Show alert
    showAlert(message, type = 'info', duration = 5000) {
        // Remove existing alert of same type
        this.removeExistingAlert();
        
        // Create alert element
        const alert = this.createAlertElement(message, type);
        
        // Add to DOM
        document.body.appendChild(alert);
        
        // Add to notifications array
        this.notifications.push(alert);
        
        // Auto remove
        setTimeout(() => {
            this.removeAlert(alert);
        }, duration);
        
        return alert;
    }
    
    // Create alert element
    createAlertElement(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="NotificationManager.getInstance().removeAlert(this.parentElement)">&times;</button>
        `;
        return alert;
    }
    
    // Remove existing alert
    removeExistingAlert() {
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            this.removeAlert(existingAlert);
        }
    }
    
    // Remove specific alert
    removeAlert(alertElement) {
        if (alertElement && alertElement.parentElement) {
            alertElement.remove();
            this.notifications = this.notifications.filter(notif => notif !== alertElement);
        }
    }
    
    // Show success message
    success(message, duration = 3000) {
        return this.showAlert(message, 'success', duration);
    }
    
    // Show error message
    error(message, duration = 5000) {
        return this.showAlert(message, 'error', duration);
    }
    
    // Show info message
    info(message, duration = 4000) {
        return this.showAlert(message, 'info', duration);
    }
    
    // Clear all notifications
    clearAll() {
        this.notifications.forEach(alert => {
            if (alert.parentElement) {
                alert.remove();
            }
        });
        this.notifications = [];
    }
}

Object.freeze(NotificationManager);