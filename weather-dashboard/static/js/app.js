// Weather Dashboard Application
class WeatherApp {
    constructor() {
        this.currentCity = null;
        this.favorites = this.loadFavorites();
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.bindEventListeners();
        this.updateCurrentDate();
        this.displayFavorites();
        
        // Load default city weather if no favorites
        if (this.favorites.length === 0) {
            this.getWeather('London');
        }
    }

    bindEventListeners() {
        // Search functionality
        const cityInput = document.getElementById('cityInput');
        const searchBtn = document.getElementById('searchBtn');
        const searchResults = document.getElementById('searchResults');

        cityInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchCity();
            }
        });
        
        searchBtn.addEventListener('click', () => this.searchCity());

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });

        // Quick city buttons
        document.querySelectorAll('.city-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                const city = e.target.dataset.city;
                this.getWeather(city);
            });
        });

        // Favorite button
        const favoriteBtn = document.getElementById('favoriteBtn');
        favoriteBtn.addEventListener('click', () => this.toggleFavorite());

        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        retryBtn.addEventListener('click', () => {
            if (this.currentCity) {
                this.getWeather(this.currentCity);
            }
        });
    }

    handleSearch(query) {
        clearTimeout(this.searchTimeout);
        const searchResults = document.getElementById('searchResults');

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        this.searchTimeout = setTimeout(() => {
            this.searchCities(query);
        }, 300);
    }

    async searchCities(query) {
        try {
            const response = await fetch(`/api/search/${encodeURIComponent(query)}`);
            const data = await response.json();

            if (response.ok) {
                this.displaySearchResults(data);
            } else {
                console.error('Search error:', data.error);
            }
        } catch (error) {
            console.error('Search failed:', error);
        }
    }

    displaySearchResults(cities) {
        const searchResults = document.getElementById('searchResults');
        
        if (cities.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No cities found</div>';
        } else {
            searchResults.innerHTML = cities.map(city => 
                `<div class="search-result-item" data-city="${city.name}">
                    <strong>${city.name}</strong>
                    ${city.state ? `, ${city.state}` : ''}, ${city.country}
                </div>`
            ).join('');

            // Add click listeners to search results
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const cityName = item.dataset.city;
                    this.getWeather(cityName);
                    searchResults.style.display = 'none';
                    document.getElementById('cityInput').value = '';
                });
            });
        }

        searchResults.style.display = 'block';
    }

    searchCity() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();
        
        if (city) {
            this.getWeather(city);
            cityInput.value = '';
            document.getElementById('searchResults').style.display = 'none';
        }
    }

    async getWeather(city) {
        this.showLoading();
        this.hideError();

        try {
            // Get current weather and forecast in parallel
            const [weatherResponse, forecastResponse] = await Promise.all([
                fetch(`/api/weather/${encodeURIComponent(city)}`),
                fetch(`/api/forecast/${encodeURIComponent(city)}`)
            ]);

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            if (weatherResponse.ok && forecastResponse.ok) {
                this.currentCity = city;
                this.displayWeather(weatherData);
                this.displayForecast(forecastData);
                this.updateFavoriteButton();
                this.hideLoading();
                this.showWeatherMain();
            } else {
                throw new Error(weatherData.error || forecastData.error || 'Failed to fetch weather data');
            }
        } catch (error) {
            console.error('Weather fetch failed:', error);
            this.showError(error.message || 'Failed to load weather data. Please try again.');
            this.hideLoading();
        }
    }

    displayWeather(data) {
        // Update basic info
        document.getElementById('currentCity').textContent = `${data.city}, ${data.country}`;
        document.getElementById('temperature').textContent = `${data.temperature}°`;
        document.getElementById('description').textContent = data.description;
        document.getElementById('feelsLike').textContent = `${data.feels_like}°`;

        // Update weather icon
        const weatherIcon = document.getElementById('weatherIcon');
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
        weatherIcon.alt = data.description;

        // Update stats
        document.getElementById('humidity').textContent = `${data.humidity}%`;
        document.getElementById('windSpeed').textContent = `${data.wind_speed} m/s`;
        document.getElementById('pressure').textContent = `${data.pressure} hPa`;
        document.getElementById('visibility').textContent = `${data.visibility} km`;

        // Update sun times
        document.getElementById('sunrise').textContent = data.sunrise;
        document.getElementById('sunset').textContent = data.sunset;
    }

    displayForecast(data) {
        const container = document.getElementById('forecastContainer');
        
        if (!data.forecasts || data.forecasts.length === 0) {
            container.innerHTML = '<p>No forecast data available</p>';
            return;
        }

        container.innerHTML = data.forecasts.map(forecast => `
            <div class="forecast-card">
                <div class="forecast-day">${forecast.day_name}</div>
                <div class="forecast-date">${this.formatDate(forecast.date)}</div>
                <img class="forecast-icon" 
                     src="https://openweathermap.org/img/wn/${forecast.icon}.png" 
                     alt="${forecast.description}">
                <div class="forecast-temps">
                    <span class="temp-max">${Math.round(forecast.temp_max)}°</span>
                    <span class="temp-min">${Math.round(forecast.temp_min)}°</span>
                </div>
                <div class="forecast-desc">${forecast.description}</div>
            </div>
        `).join('');
    }

    toggleFavorite() {
        if (!this.currentCity) return;

        const index = this.favorites.findIndex(fav => fav.city.toLowerCase() === this.currentCity.toLowerCase());
        
        if (index > -1) {
            // Remove from favorites
            this.favorites.splice(index, 1);
        } else {
            // Add to favorites
            this.addToFavorites(this.currentCity);
        }

        this.saveFavorites();
        this.updateFavoriteButton();
        this.displayFavorites();
    }

    async addToFavorites(city) {
        try {
            const response = await fetch(`/api/weather/${encodeURIComponent(city)}`);
            const data = await response.json();

            if (response.ok) {
                this.favorites.push({
                    city: data.city,
                    country: data.country,
                    temperature: data.temperature,
                    icon: data.icon,
                    addedAt: Date.now()
                });
            }
        } catch (error) {
            console.error('Failed to add to favorites:', error);
        }
    }

    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        const icon = favoriteBtn.querySelector('i');
        
        if (this.currentCity) {
            const isFavorite = this.favorites.some(fav => 
                fav.city.toLowerCase() === this.currentCity.toLowerCase()
            );
            
            if (isFavorite) {
                icon.className = 'fas fa-heart';
                favoriteBtn.classList.add('active');
                favoriteBtn.title = 'Remove from favorites';
            } else {
                icon.className = 'far fa-heart';
                favoriteBtn.classList.remove('active');
                favoriteBtn.title = 'Add to favorites';
            }
        }
    }

    displayFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const favoritesSection = document.getElementById('favoritesSection');
        
        if (this.favorites.length === 0) {
            favoritesSection.style.display = 'none';
            return;
        }

        favoritesSection.style.display = 'block';
        favoritesGrid.innerHTML = this.favorites.map((favorite, index) => `
            <div class="favorite-item" data-city="${favorite.city}">
                <button class="remove-favorite" data-index="${index}" title="Remove from favorites">
                    <i class="fas fa-times"></i>
                </button>
                <div class="favorite-city">${favorite.city}, ${favorite.country}</div>
                <div class="favorite-temp">${favorite.temperature}°C</div>
            </div>
        `).join('');

        // Add event listeners
        favoritesGrid.querySelectorAll('.favorite-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-favorite')) {
                    const city = item.dataset.city;
                    this.getWeather(city);
                }
            });
        });

        favoritesGrid.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.removeFavorite(index);
            });
        });
    }

    removeFavorite(index) {
        this.favorites.splice(index, 1);
        this.saveFavorites();
        this.displayFavorites();
        this.updateFavoriteButton();
    }

    loadFavorites() {
        try {
            const stored = localStorage.getItem('weatherFavorites');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load favorites:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('weatherFavorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }

    updateCurrentDate() {
        const currentDate = document.getElementById('currentDate');
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        currentDate.textContent = now.toLocaleDateString('en-US', options);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('weatherMain').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showWeatherMain() {
        document.getElementById('weatherMain').style.display = 'block';
        document.getElementById('errorMessage').style.display = 'none';
    }

    showError(message) {
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('weatherMain').style.display = 'none';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }
}

// Utility functions for enhanced features
class WeatherUtils {
    static getWeatherAdvice(temperature, description) {
        const temp = parseInt(temperature);
        const desc = description.toLowerCase();
        
        let advice = [];
        
        if (temp < 0) {
            advice.push("⚠️ Extremely cold - dress in layers and stay warm!");
        } else if (temp < 10) {
            advice.push("🧥 Cold weather - wear a warm coat!");
        } else if (temp < 20) {
            advice.push("👕 Mild weather - light jacket recommended.");
        } else if (temp < 30) {
            advice.push("☀️ Pleasant weather - perfect for outdoor activities!");
        } else {
            advice.push("🌡️ Hot weather - stay hydrated and seek shade!");
        }
        
        if (desc.includes('rain')) {
            advice.push("☔ Don't forget your umbrella!");
        } else if (desc.includes('snow')) {
            advice.push("❄️ Snowy conditions - drive carefully!");
        } else if (desc.includes('wind')) {
            advice.push("💨 Windy conditions - secure loose items!");
        }
        
        return advice;
    }

    static getAirQualityColor(aqi) {
        if (aqi <= 50) return '#00e400';
        if (aqi <= 100) return '#ffff00';
        if (aqi <= 150) return '#ff7e00';
        if (aqi <= 200) return '#ff0000';
        if (aqi <= 300) return '#8f3f97';
        return '#7e0023';
    }

    static windDirectionToCompass(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }
}

// Enhanced error handling and retry logic
class ErrorHandler {
    static async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
        let lastError;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (i === maxRetries - 1) {
                    throw lastError;
                }
                
                const delay = baseDelay * Math.pow(2, i);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    static getErrorMessage(error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return 'Network error - please check your internet connection.';
        }
        
        if (error.message.includes('404')) {
            return 'City not found - please check the spelling and try again.';
        }
        
        if (error.message.includes('401')) {
            return 'API key error - please contact support.';
        }
        
        if (error.message.includes('429')) {
            return 'Too many requests - please wait a moment and try again.';
        }
        
        return error.message || 'An unexpected error occurred.';
    }
}

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/js/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});

// Performance monitoring
class PerformanceMonitor {
    static logAPICall(endpoint, startTime) {
        const duration = performance.now() - startTime;
        console.log(`API call to ${endpoint} took ${duration.toFixed(2)}ms`);
        
        if (duration > 3000) {
            console.warn(`Slow API call detected: ${endpoint} (${duration.toFixed(2)}ms)`);
        }
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherApp, WeatherUtils, ErrorHandler };
}