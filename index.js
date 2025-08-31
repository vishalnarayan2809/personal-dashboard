import { loadBackgroundImage } from './modules/background.js';
import { updateTimeAndGreeting } from './modules/time.js';
import { loadWeather } from './modules/weather.js';
import { loadAdvice } from './modules/advice.js';
import { loadFacts } from './modules/facts.js';
import { handleName, setupNameForm } from './modules/name.js';
import { loadLinks, setupLinkEditor } from './modules/links.js';
import { setupBackgroundSettings } from './modules/backgroundSettings.js';

// Initialize the dashboard
function init() {
    loadBackgroundImage();
    
    setInterval(updateTimeAndGreeting, 1000);
    updateTimeAndGreeting();
    
    loadWeather();
    loadAdvice();
    loadFacts();
    
    handleName();
    setupNameForm();
    
    loadLinks();
    setupLinkEditor();

    setupBackgroundSettings();
    window.addEventListener('backgroundCategoryChanged', loadBackgroundImage);
}

init();
