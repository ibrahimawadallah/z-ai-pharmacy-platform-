#!/bin/bash

echo "🚀 Setting up Ollama Server for Pharmacy AI Platform"
echo "=================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create Ollama directory
echo "📁 Creating Ollama directory..."
mkdir -p /opt/ollama
cd /opt/ollama

# Create Docker Compose file
echo "📝 Creating Docker Compose configuration..."
cat > docker-compose.yml << EOF
version: '3.8'

services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    networks:
      - ollama-network

volumes:
  ollama_data:

networks:
  ollama-network:
    driver: bridge
EOF

# Start Ollama
echo "🚀 Starting Ollama service..."
docker-compose up -d

# Wait for Ollama to start
echo "⏳ Waiting for Ollama to start..."
sleep 10

# Test Ollama
echo "🧪 Testing Ollama connection..."
curl -f http://localhost:11434/api/tags || {
    echo "❌ Ollama failed to start"
    exit 1
}

# Download biomistral model
echo "📥 Downloading biomistral model (4.4GB)..."
echo "This may take several minutes..."
docker exec ollama ollama pull cniongolo/biomistral:latest

# Test the model
echo "🧪 Testing biomistral model..."
curl -X POST http://localhost:11434/api/generate -d '{
  "model": "cniongolo/biomistral:latest",
  "prompt": "What is paracetamol used for?",
  "stream": false
}' | jq -r '.response' | head -n 3

# Install Nginx for reverse proxy
echo "🌐 Installing Nginx..."
apt install nginx -y

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
echo "🖥️ Server IP detected: $SERVER_IP"

# Create Nginx configuration
echo "📝 Creating Nginx configuration..."
cat > /etc/nginx/sites-available/ollama << EOF
server {
    listen 80;
    server_name $SERVER_IP;

    location / {
        proxy_pass http://localhost:11434;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeout settings
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

# Enable Nginx site
echo "🔧 Enabling Nginx site..."
ln -s /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx

# Setup firewall
echo "🔒 Setting up firewall..."
ufw --force reset
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

# Create status script
echo "📊 Creating status monitoring script..."
cat > /usr/local/bin/ollama-status << 'EOF'
#!/bin/bash

echo "🏥 Ollama Server Status"
echo "======================="

# Check if container is running
if docker ps | grep -q ollama; then
    echo "✅ Ollama container: Running"
else
    echo "❌ Ollama container: Not running"
fi

# Check if port is accessible
if curl -f http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Port 11434: Accessible"
else
    echo "❌ Port 11434: Not accessible"
fi

# Check models
echo ""
echo "📦 Available Models:"
docker exec ollama ollama list 2>/dev/null || echo "No models found"

# Check resources
echo ""
echo "💾 System Resources:"
echo "Memory: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2}')"
echo "Disk: $(df -h / | tail -1 | awk '{print $3 "/" $2}')"
echo "Docker: $(docker stats --no-stream ollama 2>/dev/null | tail -1 | awk '{print $3 "/" $2}' || echo 'N/A')"

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "Unknown")
echo ""
echo "🌐 Server IP: $SERVER_IP"
echo "🔗 Ollama URL: http://$SERVER_IP"
EOF

chmod +x /usr/local/bin/ollama-status

# Create auto-restart script
echo "🔄 Creating auto-restart script..."
cat > /etc/systemd/system/ollama-auto-restart.service << EOF
[Unit]
Description=Auto-restart Ollama if it fails
After=network.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'if ! docker ps | grep -q ollama; then cd /opt/ollama && docker-compose up -d; fi'

[Install]
WantedBy=multi-user.target
EOF

# Create timer for auto-restart
cat > /etc/systemd/system/ollama-auto-restart.timer << EOF
[Unit]
Description=Run Ollama auto-restart every 5 minutes

[Timer]
OnBootSec=300
OnUnitActiveSec=300

[Install]
WantedBy=timers.target
EOF

systemctl enable ollama-auto-restart.timer
systemctl start ollama-auto-restart.timer

# Final status
echo ""
echo "🎉 Ollama Server Setup Complete!"
echo "================================="
echo ""
echo "📊 Server Information:"
echo "🖥️  Server IP: $SERVER_IP"
echo "🌐 Ollama URL: http://$SERVER_IP"
echo "🔗 API Endpoint: http://$SERVER_IP/api/generate"
echo ""
echo "📋 Next Steps:"
echo "1. Test the server: curl http://$SERVER_IP/api/tags"
echo "2. Update Vercel environment variables:"
echo "   OLLAMA_HOST=http://$SERVER_IP"
echo "3. Deploy your app to Vercel"
echo ""
echo "🔧 Management Commands:"
echo "- Check status: ollama-status"
echo "- View logs: docker logs ollama"
echo "- Restart: cd /opt/ollama && docker-compose restart"
echo "- Update: docker pull ollama/ollama && docker-compose up -d"
echo ""
echo "📞 For support, check the logs or run ollama-status"
echo ""
echo "✨ Your Ollama server is ready for Vercel integration!"
