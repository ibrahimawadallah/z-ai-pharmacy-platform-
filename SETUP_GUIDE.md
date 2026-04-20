# Environment Variables Setup Guide

## 🚀 Quick Setup Instructions

### 1. Create Environment File
Copy the example file to create your local environment:
```bash
cp .env.example .env.local
```

### 2. Database Configuration
For local development, you can use SQLite (easier) or PostgreSQL:

#### Option A: SQLite (Recommended for local development)
```env
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"
```

#### Option B: PostgreSQL
```env
DATABASE_URL="postgresql://username:password@localhost:5432/zai_pharmacy"
DIRECT_URL="postgresql://username:password@localhost:5432/zai_pharmacy"
```

### 3. Authentication Setup
Generate secure secrets for NextAuth:

```bash
# Generate NextAuth secret
openssl rand -base64 32
```

Add to your .env.local:
```env
NEXTAUTH_URL="http://localhost:5173"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXT_PUBLIC_APP_URL="http://localhost:5173"
IP_HASH_SALT="another-random-salt-here"
```

### 4. Ollama Configuration (Optional - for AI features)
```env
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="cniongolo/biomistral:latest"
OLLAMA_TIMEOUT="120000"
```

## 📋 Complete .env.local Example

```env
# Database
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:5173"
NEXTAUTH_SECRET="your-super-secret-key-here-32-chars-min"
NEXT_PUBLIC_APP_URL="http://localhost:5173"
IP_HASH_SALT="your-ip-hash-salt-here"

# Ollama AI (Optional)
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="cniongolo/biomistral:latest"
OLLAMA_TIMEOUT="120000"
```

## 🛠️ Setup Commands

After creating your .env.local file, run these commands:

```bash
# Install dependencies
bun install

# Setup database
bun run db:push

# Seed data
bunx prisma db seed

# Start development server
bun run dev
```

## 🔧 Troubleshooting

### Database Issues
- If you get database connection errors, ensure your DATABASE_URL is correct
- For SQLite, make sure the file path is accessible
- For PostgreSQL, ensure the database exists and credentials are correct

### Authentication Issues
- Make sure NEXTAUTH_SECRET is at least 32 characters long
- Verify NEXTAUTH_URL matches your development server URL
- Clear browser cookies if you get auth errors

### Port Conflicts
- The app runs on port 5173 by default
- If port is in use, you can change it: `bun run dev -- -p 3000`

## 🚀 Ready to Go!

Once setup is complete, visit: http://localhost:5173
