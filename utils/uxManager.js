// Accessibility and UX improvements
export class AccessibilityManager {
    static init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.addARIALabels();
    }

    static setupKeyboardNavigation() {
        // Add keyboard navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals
                const openModal = document.querySelector('.modal[style*="flex"]');
                if (openModal) {
                    openModal.style.display = 'none';
                    e.preventDefault();
                }
            }

            if (e.key === 'Tab') {
                this.manageFocusOutline(e);
            }
        });
    }

    static setupScreenReaderSupport() {
        // Add live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    static announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    static setupFocusManagement() {
        // Ensure focus is properly managed in modals
        document.addEventListener('focusin', (e) => {
            const modal = e.target.closest('.modal');
            if (modal && modal.style.display === 'flex') {
                // Focus is within modal, good
                return;
            }
        });
    }

    static addARIALabels() {
        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Interactive button');
            }
        });
    }

    static manageFocusOutline(e) {
        // Show focus outline for keyboard users
        document.body.classList.add('keyboard-navigation');
        
        // Remove on mouse interaction
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        }, { once: true });
    }
}

// Theme management system
export class ThemeManager {
    constructor() {
        this.themes = {
            auto: 'auto',
            light: 'light',
            dark: 'dark'
        };
        this.currentTheme = localStorage.getItem('theme') || 'auto';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeListener();
        this.createThemeToggle();
    }

    applyTheme(theme) {
        document.documentElement.removeAttribute('data-theme');
        
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }

        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    setupSystemThemeListener() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        });
    }

    createThemeToggle() {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <button class="theme-button" aria-label="Change theme">
                <span class="theme-icon">🌓</span>
            </button>
        `;

        themeToggle.addEventListener('click', () => {
            this.cycleTheme();
        });

        // Add to top-right corner
        document.body.appendChild(themeToggle);
    }

    cycleTheme() {
        const themes = Object.keys(this.themes);
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        this.applyTheme(nextTheme);
        
        // Announce theme change
        AccessibilityManager.announceToScreenReader(`Theme changed to ${nextTheme}`);
    }
}

// Performance monitoring
export class PerformanceManager {
    static init() {
        this.startTime = performance.now();
        this.metrics = {};
        this.setupPerformanceObserver();
    }

    static setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.metrics[entry.name] = entry.duration;
                });
            });

            observer.observe({ entryTypes: ['measure', 'navigation'] });
        }
    }

    static markStart(name) {
        performance.mark(`${name}-start`);
    }

    static markEnd(name) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
    }

    static getMetrics() {
        return {
            ...this.metrics,
            totalLoadTime: performance.now() - this.startTime
        };
    }
}

export { AccessibilityManager as default };
