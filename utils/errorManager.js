// Error handling and monitoring system
export class ErrorManager {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: new Date().toISOString()
            });
        });

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled promise rejection',
                stack: event.reason?.stack,
                timestamp: new Date().toISOString()
            });
        });
    }

    logError(error) {
        // Add to local error log
        this.errors.push(error);
        
        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Store in chrome storage for persistence
        chrome.storage.local.set({
            errorLog: this.errors
        });

        // In production, send to monitoring service
        this.sendToMonitoring(error);
        
        console.error('Dashboard Error:', error);
    }

    async sendToMonitoring(error) {
        // In production, implement actual error monitoring
        // e.g., Sentry, LogRocket, or custom analytics
        if (this.isProduction()) {
            try {
                // Example: Send to monitoring service
                // await fetch('your-monitoring-endpoint', {
                //     method: 'POST',
                //     body: JSON.stringify(error)
                // });
            } catch (e) {
                console.warn('Failed to send error to monitoring:', e);
            }
        }
    }

    isProduction() {
        return chrome.runtime.getManifest().version_name !== 'development';
    }

    // Get error statistics for debugging
    getErrorStats() {
        const stats = {};
        this.errors.forEach(error => {
            stats[error.type] = (stats[error.type] || 0) + 1;
        });
        return stats;
    }

    // Clear old errors
    clearErrors() {
        this.errors = [];
        chrome.storage.local.remove('errorLog');
    }
}

// User feedback system
export class FeedbackManager {
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getIcon(type)}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }

    static getIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    static showLoadingSkeleton(container) {
        container.innerHTML = `
            <div class="skeleton-loader">
                <div class="skeleton-line skeleton-line-long"></div>
                <div class="skeleton-line skeleton-line-medium"></div>
                <div class="skeleton-line skeleton-line-short"></div>
            </div>
        `;
    }
}

export default new ErrorManager();
