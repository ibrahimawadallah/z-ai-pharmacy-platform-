#!/bin/bash

# Z-AI Pharmacy Platform - Environment Setup Script
echo "🚀 Setting up Z-AI Pharmacy Platform..."

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Skipping creation."
else
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created successfully!"
fi

# Generate NextAuth secret if not present
if grep -q "YOUR_LONG_RANDOM_SECRET" .env.local; then
    echo "🔐 Generating NextAuth secret..."
    SECRET=$(openssl rand -base64 32)
    sed -i "s/YOUR_LONG_RANDOM_SECRET/$SECRET/g" .env.local
    echo "✅ NextAuth secret generated!"
fi

# Generate IP hash salt if not present
if grep -q "YOUR_RANDOM_SALT" .env.local; then
    echo "🧂 Generating IP hash salt..."
    SALT=$(openssl rand -base64 16)
    sed -i "s/YOUR_RANDOM_SALT/$SALT/g" .env.local
    echo "✅ IP hash salt generated!"
fi

# Update URLs for local development
echo "🌐 Updating URLs for local development..."
sed -i "s|https://YOUR_VERCEL_DOMAIN|http://localhost:5173|g" .env.local

# Update database for SQLite (easier for local dev)
echo "💾 Setting up SQLite database..."
sed -i 's|DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_ACCELERATE_API_KEY"|DATABASE_URL="file:./dev.db"|g' .env.local
sed -i 's|DIRECT_URL="postgres://USER:PASSWORD@db.prisma.io:5432/postgres?sslmode=require"|DIRECT_URL="file:./dev.db"|g' .env.local

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Install dependencies: bun install"
echo "   2. Setup database: bun run db:push"
echo "   3. Seed data: bunx prisma db seed"
echo "   4. Start dev server: bun run dev"
echo ""
echo "🌍 Your app will be available at: http://localhost:5173"
echo ""
echo "📝 Note: You can customize the .env.local file if needed."
