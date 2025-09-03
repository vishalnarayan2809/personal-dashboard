// Cache management for dashboard data
class CacheManager {
    constructor() {
        this.SESSION_KEY = 'dashboardSession';
        this.CACHE_KEYS = {
            WEATHER: 'cachedWeather',
            ADVICE: 'cachedAdvice',
            FACTS: 'cachedFacts',
            IMAGES: 'cachedImages',
            IMAGE_INDEX: 'currentImageIndex',
            CATEGORY: 'backgroundImageCategory'
        };
    }

    // Check if this is a new browser session
    isNewSession() {
        const sessionId = sessionStorage.getItem(this.SESSION_KEY);
        if (!sessionId) {
            // Generate new session ID
            sessionStorage.setItem(this.SESSION_KEY, Date.now().toString());
            return true;
        }
        return false;
    }

    // Generic cache getter
    getCache(key) {
        try {
            const cached = localStorage.getItem(key);
            return cached ? JSON.parse(cached) : null;
        } catch (e) {
            console.error('Cache get error:', e);
            return null;
        }
    }

    // Generic cache setter
    setCache(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error('Cache set error:', e);
        }
    }

    // Check if cached data is valid for session
    isCacheValidForSession(key) {
        const cached = this.getCache(key);
        return cached && cached.data;
    }

    // Weather cache methods
    getCachedWeather() {
        return this.isCacheValidForSession(this.CACHE_KEYS.WEATHER) 
            ? this.getCache(this.CACHE_KEYS.WEATHER).data 
            : null;
    }

    setCachedWeather(data) {
        this.setCache(this.CACHE_KEYS.WEATHER, data);
    }

    // Advice cache methods
    getCachedAdvice() {
        return this.isCacheValidForSession(this.CACHE_KEYS.ADVICE) 
            ? this.getCache(this.CACHE_KEYS.ADVICE).data 
            : null;
    }

    setCachedAdvice(data) {
        this.setCache(this.CACHE_KEYS.ADVICE, data);
    }

    // Facts cache methods
    getCachedFacts() {
        return this.isCacheValidForSession(this.CACHE_KEYS.FACTS) 
            ? this.getCache(this.CACHE_KEYS.FACTS).data 
            : null;
    }

    setCachedFacts(data) {
        this.setCache(this.CACHE_KEYS.FACTS, data);
    }

    // Image cache methods
    getCachedImages() {
        const currentCategory = localStorage.getItem('backgroundImageCategory') || 'nature';
        const cached = this.getCache(this.CACHE_KEYS.IMAGES);
        
        if (cached && cached.data && cached.data.category === currentCategory) {
            return cached.data.images;
        }
        return null;
    }

    setCachedImages(images, category) {
        this.setCache(this.CACHE_KEYS.IMAGES, {
            images: images,
            category: category
        });
    }

    // Get next image from cache rotation
    getNextImage() {
        const images = this.getCachedImages();
        if (!images || images.length === 0) return null;

        let currentIndex = parseInt(localStorage.getItem(this.CACHE_KEYS.IMAGE_INDEX)) || 0;
        currentIndex = (currentIndex + 1) % images.length;
        localStorage.setItem(this.CACHE_KEYS.IMAGE_INDEX, currentIndex.toString());
        
        return images[currentIndex];
    }

    // Clear all caches (for new sessions)
    clearSessionCaches() {
        Object.values(this.CACHE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // Clear only image cache (when category changes)
    clearImageCache() {
        localStorage.removeItem(this.CACHE_KEYS.IMAGES);
        localStorage.removeItem(this.CACHE_KEYS.IMAGE_INDEX);
    }
}

export default new CacheManager();
