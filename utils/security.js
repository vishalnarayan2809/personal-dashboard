// Security utilities for production-ready extension
export class SecurityManager {
    // Sanitize HTML content to prevent XSS
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    // Validate URLs to prevent malicious redirects
    static isValidURL(url) {
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
            return false;
        }
    }

    // Rate limiting for API calls
    static createRateLimiter(maxCalls, windowMs) {
        const calls = [];
        return () => {
            const now = Date.now();
            const windowStart = now - windowMs;
            
            // Remove old calls
            while (calls.length > 0 && calls[0] < windowStart) {
                calls.shift();
            }
            
            if (calls.length >= maxCalls) {
                return false; // Rate limit exceeded
            }
            
            calls.push(now);
            return true;
        };
    }

    // Validate and sanitize user inputs
    static validateInput(input, type) {
        switch (type) {
            case 'name':
                return input.trim().length > 0 && input.length <= 50;
            case 'url':
                return this.isValidURL(input);
            case 'text':
                return input.trim().length > 0 && input.length <= 500;
            default:
                return false;
        }
    }

    // Generate secure random IDs
    static generateSecureId() {
        return crypto.randomUUID ? crypto.randomUUID() : 
               'xxxx-xxxx-xxxx'.replace(/[x]/g, () => 
                   (Math.random() * 16 | 0).toString(16));
    }
}

// Content Security Policy helpers
export const CSPManager = {
    // Check if inline scripts are allowed (for development)
    isDevelopment: () => {
        return !chrome.runtime.getManifest().content_security_policy;
    },
    
    // Log CSP violations for monitoring
    logCSPViolation: (violation) => {
        console.warn('CSP Violation:', violation);
        // In production, send to analytics service
    }
};
