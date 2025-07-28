from flask import Flask, render_template, request, jsonify
import requests
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)

# Configuration
API_KEY = os.environ.get('OPENWEATHER_API_KEY', 'your_api_key_here')
BASE_URL = "http://api.openweathermap.org/data/2.5"
GEO_URL = "http://api.openweathermap.org/geo/1.0"

class WeatherService:
    def __init__(self, api_key):
        self.api_key = api_key
    
    def get_current_weather(self, city):
        """Get current weather for a city"""
        try:
            url = f"{BASE_URL}/weather"
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': f'API request failed: {str(e)}'}
        except Exception as e:
            return {'error': f'Unexpected error: {str(e)}'}
    
    def get_forecast(self, city, days=5):
        """Get weather forecast for a city"""
        try:
            url = f"{BASE_URL}/forecast"
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Process forecast data to get daily forecasts
            daily_forecasts = []
            current_date = None
            
            for item in data['list'][:days * 8]:  # 8 forecasts per day (3-hour intervals)
                forecast_date = datetime.fromtimestamp(item['dt']).date()
                
                if current_date != forecast_date:
                    daily_forecasts.append({
                        'date': forecast_date.strftime('%Y-%m-%d'),
                        'day_name': forecast_date.strftime('%A'),
                        'temp_max': item['main']['temp_max'],
                        'temp_min': item['main']['temp_min'],
                        'description': item['weather'][0]['description'],
                        'icon': item['weather'][0]['icon'],
                        'humidity': item['main']['humidity'],
                        'wind_speed': item['wind']['speed']
                    })
                    current_date = forecast_date
                
                if len(daily_forecasts) >= days:
                    break
            
            return {'city': data['city'], 'forecasts': daily_forecasts}
        except requests.exceptions.RequestException as e:
            return {'error': f'API request failed: {str(e)}'}
        except Exception as e:
            return {'error': f'Unexpected error: {str(e)}'}
    
    def search_cities(self, query):
        """Search for cities by name"""
        try:
            url = f"{GEO_URL}/direct"
            params = {
                'q': query,
                'limit': 5,
                'appid': self.api_key
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': f'API request failed: {str(e)}'}
        except Exception as e:
            return {'error': f'Unexpected error: {str(e)}'}

weather_service = WeatherService(API_KEY)

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/api/weather/<city>')
def get_weather(city):
    """API endpoint to get current weather"""
    data = weather_service.get_current_weather(city)
    
    if 'error' in data:
        return jsonify(data), 400
    
    # Process the data for frontend
    weather_data = {
        'city': data['name'],
        'country': data['sys']['country'],
        'temperature': round(data['main']['temp']),
        'feels_like': round(data['main']['feels_like']),
        'description': data['weather'][0]['description'].title(),
        'icon': data['weather'][0]['icon'],
        'humidity': data['main']['humidity'],
        'pressure': data['main']['pressure'],
        'wind_speed': data['wind']['speed'],
        'wind_direction': data['wind'].get('deg', 0),
        'visibility': data.get('visibility', 0) / 1000,  # Convert to km
        'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).strftime('%H:%M'),
        'sunset': datetime.fromtimestamp(data['sys']['sunset']).strftime('%H:%M'),
        'timezone': data['timezone']
    }
    
    return jsonify(weather_data)

@app.route('/api/forecast/<city>')
def get_forecast(city):
    """API endpoint to get weather forecast"""
    days = request.args.get('days', 5, type=int)
    data = weather_service.get_forecast(city, days)
    
    if 'error' in data:
        return jsonify(data), 400
    
    return jsonify(data)

@app.route('/api/search/<query>')
def search_cities(query):
    """API endpoint to search for cities"""
    data = weather_service.search_cities(query)
    
    if 'error' in data:
        return jsonify(data), 400
    
    # Format city results
    cities = []
    for city in data:
        cities.append({
            'name': city['name'],
            'country': city['country'],
            'state': city.get('state', ''),
            'lat': city['lat'],
            'lon': city['lon'],
            'display_name': f"{city['name']}, {city.get('state', '')}, {city['country']}"
        })
    
    return jsonify(cities)

@app.route('/health')
def health_check():
    """Health check endpoint for load balancer"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)