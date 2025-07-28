# Weather Dashboard 🌤️

A modern, real-time weather dashboard application that provides comprehensive weather information for cities worldwide. Built with Flask backend and vanilla JavaScript frontend, designed for practical daily use.

## 🌟 Features

### Core Functionality
- **Real-time Weather Data**: Current weather conditions with detailed metrics
- **5-Day Forecast**: Extended weather forecasting with daily breakdowns
- **City Search**: Intelligent search with autocomplete suggestions
- **Favorites System**: Save and quickly access favorite cities
- **Quick Access**: Pre-configured buttons for major cities
- **Responsive Design**: Works perfectly on desktop and mobile devices

### User Interaction Features
- **Smart Search**: Type-ahead search with city suggestions
- **Sorting & Filtering**: Organize weather data effectively
- **Local Storage**: Persistent favorites across browser sessions
- **Error Handling**: Graceful handling of API failures and network issues
- **Loading States**: Smooth loading animations and feedback

### Technical Features
- **Modern UI**: Beautiful gradients, animations, and responsive design
- **Performance Optimized**: Parallel API calls and efficient caching
- **Docker Ready**: Containerized for easy deployment
- **Load Balancer Compatible**: Health checks and multiple instance support
- **Security Best Practices**: Environment variable configuration

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))
- Docker (for containerization)

### Local Development

1. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd weather-dashboard
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenWeatherMap API key
   ```

5. **Run Application**
   ```bash
   python app.py
   ```

   Visit `http://localhost:8080` to see the application.

## 🐳 Docker Deployment

### Part 2A: Docker Hub + Load Balancer Deployment

#### 1. Build and Test Locally

```bash
# Build the Docker image
docker build -t <your-dockerhub-username>/weather-dashboard:v1 .

# Test locally
docker run -p 8080:8080 -e OPENWEATHER_API_KEY=your_api_key_here <your-dockerhub-username>/weather-dashboard:v1

# Verify it works
curl http://localhost:8080/health
```

#### 2. Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push the image
docker push <your-dockerhub-username>/weather-dashboard:v1

# Also tag as latest
docker tag <your-dockerhub-username>/weather-dashboard:v1 <your-dockerhub-username>/weather-dashboard:latest
docker push <your-dockerhub-username>/weather-dashboard:latest
```

#### 3. Deploy on Lab Machines

**On Web-01 and Web-02:**
```bash
# Pull the image
docker pull <your-dockerhub-username>/weather-dashboard:v1

# Run the container
docker run -d \
  --name weather-app \
  --restart unless-stopped \
  -p 8080:8080 \
  -e OPENWEATHER_API_KEY=your_api_key_here \
  <your-dockerhub-username>/weather-dashboard:v1

# Verify it's running
docker ps
curl http://localhost:8080/health
```

#### 4. Configure Load Balancer (Lb-01)

Update `/etc/haproxy/haproxy.cfg`:

```haproxy
global
    daemon
    maxconn 4096

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend weather_frontend
    bind *:80
    default_backend weather_backend

backend weather_backend
    balance roundrobin
    option httpchk GET /health
    server web01 172.20.0.11:8080 check
    server web02 172.20.0.12:8080 check
```

Reload HAProxy:
```bash
docker exec -it lb-01 sh -c 'haproxy -sf $(pidof haproxy) -f /etc/haproxy/haproxy.cfg'
```

#### 5. Test End-to-End

```bash
# Test load balancing
for i in {1..10}; do
  curl -s http://localhost/health | jq .
  sleep 1
done

# Check application functionality
curl http://localhost/api/weather/London
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key | - | ✅ |
| `PORT` | Application port | 8080 | ❌ |
| `DEBUG` | Enable debug mode | False | ❌ |
| `FLASK_ENV` | Flask environment | production | ❌ |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main dashboard page |
| `/api/weather/<city>` | GET | Current weather for city |
| `/api/forecast/<city>` | GET | 5-day forecast for city |
| `/api/search/<query>` | GET | Search cities by name |
| `/health` | GET | Health check endpoint |

## 🧪 Testing and Verification

### Load Balancer Testing

1. **Round-Robin Verification**
   ```bash
   # Test multiple requests
   for i in {1..6}; do
     echo "Request $i:"
     curl -s http://localhost/health | jq '.timestamp'
     sleep 1
   done
   ```

2. **Application Functionality**
   ```bash
   # Test weather API
   curl http://localhost/api/weather/Paris | jq '.'
   
   # Test search
   curl http://localhost/api/search/New | jq '.'
   ```

3. **Failover Testing**
   ```bash
   # Stop one container and verify traffic continues
   docker stop weather-app  # On one server
   curl http://localhost/health  # Should still work
   ```

### Performance Testing

```bash
# Simple load test
ab -n 100 -c 10 http://localhost/api/weather/London
```

## 🔒 Security Considerations

### API Key Management
- ✅ Environment variables (not in code)
- ✅ Docker secrets support
- ✅ No API keys in version control

### Application Security
- ✅ Non-root user in Docker container
- ✅ Input validation and sanitization
- ✅ Error handling without information disclosure
- ✅ HTTPS ready (configure reverse proxy)

### Production Hardening
```bash
# Use Docker secrets in production
echo "your_api_key" | docker secret create openweather_api_key -

# Run with secret
docker service create \
  --name weather-dashboard \
  --secret openweather_api_key \
  --env OPENWEATHER_API_KEY_FILE=/run/secrets/openweather_api_key \
  <your-dockerhub-username>/weather-dashboard:v1
```

## 📊 Monitoring and Logging

### Health Checks
The application includes comprehensive health checks:
- Container health check every 30 seconds
- Load balancer health check endpoint
- Application status monitoring

### Logging
```bash
# View application logs
docker logs weather-app -f

# View HAProxy logs
docker logs lb-01 -f
```

## 🚀 Advanced Features

### Performance Optimizations
- Parallel API calls for weather and forecast data
- Client-side caching with localStorage
- Optimized Docker image with multi-stage builds
- Gzip compression ready

### Scaling Considerations
- Stateless application design
- External configuration support
- Database-ready architecture (for future enhancements)
- Kubernetes manifests available in `k8s/` directory

## 🔄 CI/CD Pipeline (Bonus)

### GitHub Actions Workflow
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker image
        uses: docker/build-push-action@v3
        with:
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/weather-dashboard:${{ github.sha }}
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Error**
   ```
   Error: API key error - please contact support
   ```
   **Solution**: Verify your OpenWeatherMap API key is correct and active.

2. **Network Timeout**
   ```
   Error: Network error - please check your internet connection
   ```
   **Solution**: Check internet connectivity and firewall settings.

3. **City Not Found**
   ```
   Error: City not found - please check the spelling and try again
   ```
   **Solution**: Use the search feature to find the correct city name.

### Debug Mode
```bash
# Run in debug mode
docker run -p 8080:8080 -e DEBUG=True -e OPENWEATHER_API_KEY=your_key <image>
```

## 📈 Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Weather maps integration
- [ ] User authentication system
- [ ] Weather widgets for embedding
- [ ] Mobile app version
- [ ] Multiple language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenWeatherMap API**: Reliable weather data provider
- **Font Awesome**: Beautiful icons
- **Google Fonts**: Inter font family
- **Docker**: Containerization platform

## 📞 Support

For support and questions:
- Open an issue in the GitHub repository
- Check the troubleshooting section above
- Review the OpenWeatherMap API documentation

---

**Built with ❤️ for practical weather monitoring**