// Temperature unit management
import { loadWeather } from './weather.js';
import cacheManager from './cacheManager.js';

export function setupTemperatureUnitToggle() {
    const toggleButton = document.getElementById('temperature-unit-toggle');
    
    if (!toggleButton) {
        console.warn('Temperature unit toggle button not found');
        return;
    }

    // Set initial button text based on saved preference
    updateToggleButtonText();

    // Add click event listener
    toggleButton.addEventListener('click', toggleTemperatureUnit);
}

function updateToggleButtonText() {
    const toggleButton = document.getElementById('temperature-unit-toggle');
    const currentUnit = localStorage.getItem('temperatureUnit') || 'imperial';
    
    toggleButton.textContent = currentUnit === 'imperial' ? '°F' : '°C';
    toggleButton.title = `Currently showing in ${currentUnit === 'imperial' ? 'Fahrenheit' : 'Celsius'}. Click to switch.`;
}

async function toggleTemperatureUnit() {
    const currentUnit = localStorage.getItem('temperatureUnit') || 'imperial';
    const newUnit = currentUnit === 'imperial' ? 'metric' : 'imperial';
    
    // Save new preference
    localStorage.setItem('temperatureUnit', newUnit);
    
    // Update button text
    updateToggleButtonText();
    
    // Clear weather cache to force refresh with new units
    cacheManager.setCachedWeather(null);
    
    // Show loading state
    const weatherElement = document.getElementById('weather');
    const originalContent = weatherElement.innerHTML;
    weatherElement.innerHTML = `
        <div class="weather-loading">
            <div class="loading"></div>
            <span class="loading-text">Converting temperature...</span>
        </div>
    `;
    
    try {
        // Reload weather with new units
        await loadWeather();
        
        // Show success feedback
        showTemperatureUnitFeedback(newUnit);
        
    } catch (error) {
        console.error('Failed to refresh weather with new units:', error);
        // Restore original content on error
        weatherElement.innerHTML = originalContent;
        
        // Show error feedback
        showTemperatureUnitError();
    }
}

function showTemperatureUnitFeedback(unit) {
    // Create a small toast notification
    const toast = document.createElement('div');
    toast.className = 'temp-unit-toast';
    toast.innerHTML = `
        <span>Temperature unit changed to ${unit === 'imperial' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}</span>
    `;
    
    // Style the toast
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        animation: slideUpFade 3s ease-out forwards;
        backdrop-filter: blur(10px);
    `;
    
    // Add animation CSS if not already present
    if (!document.querySelector('#temp-unit-styles')) {
        const style = document.createElement('style');
        style.id = 'temp-unit-styles';
        style.textContent = `
            @keyframes slideUpFade {
                0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

function showTemperatureUnitError() {
    const toast = document.createElement('div');
    toast.className = 'temp-unit-toast error';
    toast.innerHTML = `
        <span>Failed to update temperature unit. Please try again.</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(244, 67, 54, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        animation: slideUpFade 3s ease-out forwards;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// Export the current temperature unit for other modules
export function getCurrentTemperatureUnit() {
    return localStorage.getItem('temperatureUnit') || 'imperial';
}

// Export function to get unit symbol
export function getTemperatureUnitSymbol(unit = null) {
    const tempUnit = unit || getCurrentTemperatureUnit();
    return tempUnit === 'imperial' ? '°F' : '°C';
}
