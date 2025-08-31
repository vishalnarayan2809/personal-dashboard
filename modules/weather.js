
import config from '../config.js';

function getWeatherIcon(weatherMain, weatherDescription) {
    const main = weatherMain.toLowerCase();
    const description = weatherDescription.toLowerCase();
    
    if (main.includes('clear') || main.includes('sun')) {
        return './assets/sun.png';
    } else if (main.includes('cloud')) {
        if (description.includes('few') || description.includes('scattered')) {
            return './assets/cloudy-day.png';
        }
        return './assets/cloud.png';
    } else if (main.includes('rain') || main.includes('drizzle') || main.includes('storm')) {
        return './assets/rainy.png';
    } else if (main.includes('wind') || main.includes('tornado')) {
        return './assets/windy.png';
    } else if (main.includes('snow') || main.includes('mist') || main.includes('fog')) {
        return './assets/cloud.png';
    } else {
        return './assets/cloudy-day.png';
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
    const localIcon = getWeatherIcon(data.weather[0].main, data.weather[0].description);
    document.getElementById("weather").innerHTML = `
        <img src="${localIcon}" alt="${data.weather[0].description}" />
        <p class="weather-temp">${Math.round(data.main.temp)}º</p>
        <p class="weather-city">${data.name}</p>
    `;
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
