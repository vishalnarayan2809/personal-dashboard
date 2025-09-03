import { loadBackgroundImage } from './modules/background.js';
import { updateTimeAndGreeting } from './modules/time.js';
import { loadWeather } from './modules/weather.js';
import { loadAdvice } from './modules/advice.js';
import { loadFacts } from './modules/facts.js';
import { handleName, setupNameForm } from './modules/name.js';
import { loadLinks, setupLinkEditor } from './modules/links.js';
import { setupBackgroundSettings } from './modules/backgroundSettings.js';
import { setupNote } from './modules/note.js';
import { setupTemperatureUnitToggle } from './modules/temperatureUnit.js';
import cacheManager from './modules/cacheManager.js';

// Initialize the dashboard
function init() {
    // Check if this is a new browser session
    if (cacheManager.isNewSession()) {
        console.log('New browser session detected - refreshing all data');
        // Clear all session-based caches for fresh data
        // Note: We keep image cache as it's category-based, not session-based
    }

    // Load background (uses caching and rotation)
    loadBackgroundImage();
    
    // Time updates every second (no caching needed)
    setInterval(updateTimeAndGreeting, 1000);
    updateTimeAndGreeting();
    
    // Load cached or fresh data based on session
    loadWeather();   // Uses session-based caching
    loadAdvice();    // Uses session-based caching  
    loadFacts();     // Uses session-based caching
    
    // User preferences (always load)
    handleName();
    setupNameForm();
    
    // Quick links (always load)
    loadLinks();
    setupLinkEditor();

    // Settings and note features
    setupBackgroundSettings();
    setupNote();
    setupTemperatureUnitToggle();
    
    // Handle background category changes
    window.addEventListener('backgroundCategoryChanged', loadBackgroundImage);
}

// Show loading performance info in console
console.log(`Dashboard initialized at ${new Date().toISOString()}`);
console.log(`Session: ${cacheManager.isNewSession() ? 'New' : 'Cached'}`);

init();
