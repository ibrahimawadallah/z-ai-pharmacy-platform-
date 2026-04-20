#!/bin/bash

echo "🚀 Step-by-Step Ollama Setup for Pharmacy AI"
echo "=============================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Step 1: Update system
echo "📦 Step 1: Updating system..."
apt update && apt upgrade -y

# Step 2: Install Docker
echo "🐳 Step 2: Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Step 3: Install useful tools
echo "🔧 Step 3: Installing tools..."
apt install -y curl wget jq htop ufw

# Step 4: Setup firewall
echo "🔒 Step 4: Setting up firewall..."
ufw --force reset
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 11434
ufw --force enable

# Step 5: Create Ollama directory
echo "📁 Step 5: Creating directories..."
mkdir -p /opt/ollama
cd /opt/ollama

# Step 6: Create docker-compose file
echo "📝 Step 6: Creating Docker configuration..."
cat > docker-compose.yml << 'EOF'
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
        limits:
          memory: 2G
        reservations:
          memory: 1G
    networks:
      - ollama-network

volumes:
  ollama_data:

networks:
  ollama-network:
    driver: bridge
EOF

# Step 7: Start Ollama
echo "🚀 Step 7: Starting Ollama..."
docker-compose up -d

# Step 8: Wait for Ollama to start
echo "⏳ Step 8: Waiting for Ollama to start..."
sleep 20

# Step 9: Test connection
echo "🧪 Step 9: Testing connection..."
if curl -f http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running successfully!"
else
    echo "❌ Ollama failed to start"
    docker logs ollama
    exit 1
fi

# Step 10: Get server IP
echo "🌐 Step 10: Getting server IP..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "localhost")
echo "Server IP: $SERVER_IP"

# Step 11: Test external access
echo "🌍 Step 11: Testing external access..."
if curl -f http://$SERVER_IP:11434/api/tags > /dev/null 2>&1; then
    echo "✅ External access working!"
else
    echo "⚠️  External access not working - check firewall"
fi

# Step 12: Pull biomistral model
echo "📥 Step 12: Downloading biomistral model..."
echo "This will take 5-10 minutes..."
docker exec ollama ollama pull cniongolo/biomistral:latest

# Step 13: Test model
echo "🧠 Step 13: Testing biomistral model..."
echo "Testing with a simple medical query..."
RESPONSE=$(curl -s -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "cniongolo/biomistral:latest",
    "prompt": "What is paracetamol used for? Answer in one sentence.",
    "stream": false
  }' | jq -r '.response')

echo "Model response: $RESPONSE"

# Step 14: Create management scripts
echo "🔧 Step 14: Creating management scripts..."

# Status script
cat > /usr/local/bin/ollama-status << 'EOF'
#!/bin/bash
echo "🏥 Ollama Server Status"
echo "======================"
echo "🌐 Server IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Unknown')"
echo "🔗 Ollama URL: http://$(curl -s ifconfig.me 2>/dev/null || echo 'localhost'):11434"
echo ""
echo "📦 Available Models:"
docker exec ollama ollama list 2>/dev/null | grep -E "(Name|Size)" || echo "No models found"
echo ""
echo "💾 System Resources:"
echo "Memory Usage: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2 " (" int($3/$2 * 100) "%)"}')"
echo "Disk Usage: $(df -h / | tail -1 | awk '{print $3 "/" $2 " (" int($3/$2 * 100) "%)"}')"
echo "Docker Stats: $(docker stats --no-stream ollama 2>/dev/null | tail -1 | awk '{print $3 "/" $2}' || echo 'N/A')"
echo ""
echo "🔥 Recent Logs:"
docker logs ollama --tail 5 2>/dev/null || echo "No logs available"
EOF

chmod +x /usr/local/bin/ollama-status

# Update script
cat > /usr/local/bin/ollama-update << 'EOF'
#!/bin/bash
echo "🔄 Updating Ollama..."
cd /opt/ollama
docker-compose pull
docker-compose up -d
echo "✅ Ollama updated!"
echo "📦 Checking models..."
docker exec ollama ollama list
EOF

chmod +x /usr/local/bin/ollama-update

# Restart script
cat > /usr/local/bin/ollama-restart << 'EOF'
#!/bin/bash
echo "🔄 Restarting Ollama..."
cd /opt/ollama
docker-compose restart
echo "✅ Ollama restarted!"
sleep 5
ollama-status
EOF

chmod +x /usr/local/bin/ollama-restart

# Step 15: Final status
echo ""
echo "🎉 Ollama Setup Complete!"
echo "=========================="
echo ""
echo "📊 Server Information:"
echo "🖥️  Server IP: $SERVER_IP"
echo "🌐 Ollama URL: http://$SERVER_IP:11434"
echo "🔗 API Endpoint: http://$SERVER_IP:11434/api/generate"
echo ""
echo "📋 Next Steps for Vercel Integration:"
echo "1. On your local machine, run:"
echo "   vercel env add OLLAMA_HOST production"
echo "2. Enter this value when prompted:"
echo "   http://$SERVER_IP:11434"
echo "3. Redeploy your Vercel app:"
echo "   vercel --prod"
echo ""
echo "🔧 Management Commands:"
echo "- Check status: ollama-status"
echo "- Update Ollama: ollama-update"
echo "- Restart service: ollama-restart"
echo "- View logs: docker logs ollama"
echo "- Access container: docker exec -it ollama bash"
echo ""
echo "🧪 Test Commands:"
echo "- List models: curl http://$SERVER_IP:11434/api/tags"
echo "- Test API: curl -X POST http://$SERVER_IP:11434/api/generate -d '{\"model\":\"cniongolo/biomistral:latest\",\"prompt\":\"Hello\",\"stream\":false}'"
echo ""
echo "✨ Your Ollama server is ready for production use!"
echo "🏥 Medical AI model (biomistral) is installed and ready!"
EOF

chmod +x /opt/ollama/step-by-step-setup.sh
