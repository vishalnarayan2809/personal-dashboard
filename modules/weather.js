
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

export function loadWeather() {
    navigator.geolocation.getCurrentPosition(async position => {
        document.getElementById("weather").innerHTML = `
            <div class="weather-loading">
                <div class="loading"></div>
                <span class="loading-text">Loading weather...</span>
            </div>
        `;
        
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=${config.OPENWEATHER_API_KEY}`)
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            const data = await res.json()
            const localIcon = getWeatherIcon(data.weather[0].main, data.weather[0].description)
            document.getElementById("weather").innerHTML = `
                <img src="${localIcon}" alt="${data.weather[0].description}" />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `
        } catch (err) {
            console.error(err)
            document.getElementById("weather").innerHTML = `
                <span class="loading-text">Weather unavailable</span>
            `;
        }
    });
}
