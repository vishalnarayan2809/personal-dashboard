
import config from '../config.js';

function getWeatherIcon(weatherMain, weatherDescription) {
    const main = weatherMain.toLowerCase();
    const description = weatherDescription.toLowerCase();
    
    if (main.includes('clear') || main.includes('sun')) {
        return 'sunny';
    } else if (main.includes('cloud')) {
        if (description.includes('few') || description.includes('scattered')) {
            return 'partly-cloudy';
        }
        return 'cloudy';
    } else if (main.includes('rain') || main.includes('drizzle')) {
        return 'rainy';
    } else if (main.includes('storm') || main.includes('thunder')) {
        return 'stormy';
    } else if (main.includes('snow')) {
        return 'snowy';
    } else if (main.includes('wind') || main.includes('tornado')) {
        return 'windy';
    } else if (main.includes('mist') || main.includes('fog')) {
        return 'foggy';
    } else {
        return 'partly-cloudy';
    }
}

function createWeatherIcon(weatherType) {
    switch(weatherType) {
        case 'sunny':
            return `
                <div class="weather-icon sunny">
                    <div class="sun">
                        <div class="sun-rays"></div>
                        <div class="sun-core"></div>
                    </div>
                </div>
            `;
        case 'partly-cloudy':
            return `
                <div class="weather-icon partly-cloudy">
                    <div class="sun-small">
                        <div class="sun-rays-small"></div>
                        <div class="sun-core-small"></div>
                    </div>
                    <div class="cloud"></div>
                </div>
            `;
        case 'cloudy':
            return `
                <div class="weather-icon cloudy">
                    <div class="cloud"></div>
                    <div class="cloud cloud-2"></div>
                </div>
            `;
        case 'rainy':
            return `
                <div class="weather-icon rainy">
                    <div class="cloud rain-cloud"></div>
                    <div class="rain">
                        <div class="rain-drop"></div>
                        <div class="rain-drop"></div>
                        <div class="rain-drop"></div>
                        <div class="rain-drop"></div>
                        <div class="rain-drop"></div>
                    </div>
                </div>
            `;
        case 'stormy':
            return `
                <div class="weather-icon stormy">
                    <div class="cloud storm-cloud"></div>
                    <div class="lightning"></div>
                    <div class="rain">
                        <div class="rain-drop"></div>
                        <div class="rain-drop"></div>
                        <div class="rain-drop"></div>
                    </div>
                </div>
            `;
        case 'snowy':
            return `
                <div class="weather-icon snowy">
                    <div class="cloud snow-cloud"></div>
                    <div class="snow">
                        <div class="snowflake">❄</div>
                        <div class="snowflake">❅</div>
                        <div class="snowflake">❆</div>
                        <div class="snowflake">❄</div>
                        <div class="snowflake">❅</div>
                    </div>
                </div>
            `;
        case 'windy':
            return `
                <div class="weather-icon windy">
                    <div class="wind-lines">
                        <div class="wind-line"></div>
                        <div class="wind-line"></div>
                        <div class="wind-line"></div>
                    </div>
                </div>
            `;
        case 'foggy':
            return `
                <div class="weather-icon foggy">
                    <div class="fog">
                        <div class="fog-line"></div>
                        <div class="fog-line"></div>
                        <div class="fog-line"></div>
                        <div class="fog-line"></div>
                    </div>
                </div>
            `;
        default:
            return `
                <div class="weather-icon partly-cloudy">
                    <div class="sun-small">
                        <div class="sun-rays-small"></div>
                        <div class="sun-core-small"></div>
                    </div>
                    <div class="cloud"></div>
                </div>
            `;
    }
}

async function fetchWeatherData(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${config.OPENWEATHER_API_KEY}`);
    if (!res.ok) {
        throw Error("Weather data not available");
    }
    return await res.json();
}

function displayWeather(data) {
    const weatherType = getWeatherIcon(data.weather[0].main, data.weather[0].description);
    const iconHTML = createWeatherIcon(weatherType);
    
    document.getElementById("weather").innerHTML = `
        ${iconHTML}
        <div class="weather-info">
            <p class="weather-temp">${Math.round(data.main.temp)}º</p>
            <p class="weather-city">${data.name}</p>
        </div>
    `;
    
    // Add weather-specific background effects
    document.getElementById("weather").className = `weather-container ${weatherType}`;
}

function showWeatherError() {
    document.getElementById("weather").innerHTML = `
        <span class="loading-text">Weather unavailable</span>
    `;
}

function showWeatherLoading() {
    document.getElementById("weather").innerHTML = `
        <div class="weather-loading">
            <div class="loading"></div>
            <span class="loading-text">Loading weather...</span>
        </div>
    `;
}

export function loadWeather() {
    showWeatherLoading();
    
    // Check if we have cached location data (valid for 30 minutes)
    const cachedLocation = localStorage.getItem('weatherLocation');
    const cacheTime = localStorage.getItem('weatherLocationTime');
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    if (cachedLocation && cacheTime && (Date.now() - parseInt(cacheTime)) < thirtyMinutes) {
        const location = JSON.parse(cachedLocation);
        fetchWeatherData(location.lat, location.lon)
            .then(displayWeather)
            .catch(err => {
                console.error(err);
                showWeatherError();
            });
        return;
    }
    
    // Check if geolocation is available
    if (!navigator.geolocation) {
        showWeatherError();
        return;
    }
    
    // Request location with better error handling
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                // Cache the location data
                const locationData = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                localStorage.setItem('weatherLocation', JSON.stringify(locationData));
                localStorage.setItem('weatherLocationTime', Date.now().toString());
                
                const data = await fetchWeatherData(locationData.lat, locationData.lon);
                displayWeather(data);
            } catch (err) {
                console.error(err);
                showWeatherError();
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            // Try to use cached location if available, even if expired
            const cachedLocation = localStorage.getItem('weatherLocation');
            if (cachedLocation) {
                const location = JSON.parse(cachedLocation);
                fetchWeatherData(location.lat, location.lon)
                    .then(displayWeather)
                    .catch(() => showWeatherError());
            } else {
                showWeatherError();
            }
        },
        {
            enableHighAccuracy: false, // Faster, less battery
            timeout: 10000, // 10 second timeout
            maximumAge: 1800000 // Accept cached position up to 30 minutes old
        }
    );
}
