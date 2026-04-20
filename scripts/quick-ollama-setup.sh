#!/bin/bash

echo "🚀 Quick Ollama Server Setup for Pharmacy AI"
echo "=========================================="

# Get server IP
echo "📍 Getting server IP..."
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
echo "Server IP: $SERVER_IP"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    sudo systemctl enable docker
    sudo systemctl start docker
fi

# Pull and run Ollama
echo "🦙 Starting Ollama..."
docker run -d \
    --name ollama \
    -v ollama:/root/.ollama \
    -p 11434:11434 \
    --restart unless-stopped \
    ollama/ollama

# Wait for Ollama to start
echo "⏳ Waiting for Ollama to start..."
sleep 15

# Test connection
echo "🧪 Testing Ollama connection..."
if curl -f http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running!"
else
    echo "❌ Ollama failed to start"
    exit 1
fi

# Pull biomistral model
echo "📥 Downloading biomistral model (4.4GB)..."
echo "This may take 5-10 minutes..."
docker exec ollama ollama pull cniongolo/biomistral:latest

# Test model
echo "🧪 Testing biomistral model..."
curl -X POST http://localhost:11434/api/generate -d '{
  "model": "cniongolo/biomistral:latest",
  "prompt": "What is paracetamol used for?",
  "stream": false
}' | jq -r '.response' | head -n 2

# Setup firewall
echo "🔒 Setting up firewall..."
sudo ufw allow 11434/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create status script
echo "📊 Creating status script..."
cat > ~/ollama-status << 'EOF'
#!/bin/bash
echo "🏥 Ollama Server Status"
echo "======================"
echo "🌐 Server IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Unknown')"
echo "🔗 Ollama URL: http://$(curl -s ifconfig.me 2>/dev/null || echo 'localhost'):11434"
echo ""
echo "📦 Models:"
docker exec ollama ollama list 2>/dev/null || echo "No models found"
echo ""
echo "💾 Resources:"
echo "Memory: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2}')"
echo "Docker: $(docker stats --no-stream ollama 2>/dev/null | tail -1 | awk '{print $3 "/" $2}' || echo 'N/A')"
EOF

chmod +x ~/ollama-status

# Create update script
echo "🔄 Creating update script..."
cat > ~/update-ollama << 'EOF'
#!/bin/bash
echo "🔄 Updating Ollama..."
docker pull ollama/ollama:latest
docker stop ollama
docker rm ollama
docker run -d \
    --name ollama \
    -v ollama:/root/.ollama \
    -p 11434:11434 \
    --restart unless-stopped \
    ollama/ollama
echo "✅ Ollama updated!"
EOF

chmod +x ~/update-ollama

echo ""
echo "🎉 Ollama Setup Complete!"
echo "=========================="
echo ""
echo "📊 Server Information:"
echo "🖥️  Server IP: $SERVER_IP"
echo "🌐 Ollama URL: http://$SERVER_IP:11434"
echo "🔗 API Endpoint: http://$SERVER_IP:11434/api/generate"
echo ""
echo "📋 Next Steps:"
echo "1. Test: curl http://$SERVER_IP:11434/api/tags"
echo "2. Update Vercel: vercel env add OLLAMA_HOST production"
echo "3. Enter: http://$SERVER_IP:11434"
echo "4. Redeploy: vercel --prod"
echo ""
echo "🔧 Management:"
echo "- Status: ~/ollama-status"
echo "- Update: ~/update-ollama"
echo "- Logs: docker logs ollama"
echo "- Restart: docker restart ollama"
echo ""
echo "✨ Your Ollama server is ready for Vercel integration!"
