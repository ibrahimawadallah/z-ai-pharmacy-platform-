# Z-AI Pharmacy Platform - Complete Setup Guide

## 🚀 Environment Setup Instructions

### ⚠️ Required Setup Steps

#### 1. Create Environment File
Since the project uses PostgreSQL by default, you need to create a local environment file:

**For Windows:**
```cmd
setup.bat
```

**For Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual Setup:**
```bash
cp .env.example .env.local
```

#### 2. Configure Database (Choose One Option)

**Option A: SQLite (Easiest for Local Development)**
Edit `.env.local` and replace the database URLs:
```env
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"
```

**Option B: PostgreSQL (Recommended for Production)**
1. Install PostgreSQL locally or use Docker
2. Create database: `createdb zai_pharmacy`
3. Update `.env.local`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/zai_pharmacy"
DIRECT_URL="postgresql://username:password@localhost:5432/zai_pharmacy"
```

#### 3. Generate Authentication Secrets
The setup scripts will auto-generate these, or you can generate manually:

```bash
# Generate NextAuth secret (32+ characters)
openssl rand -base64 32

# Generate IP hash salt
openssl rand -base64 16
```

Update `.env.local`:
```env
NEXTAUTH_URL="http://localhost:5173"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXT_PUBLIC_APP_URL="http://localhost:5173"
IP_HASH_SALT="your-generated-salt-here"
```

#### 4. Ollama AI Configuration (Optional)
For AI features, install Ollama and update:
```env
OLLAMA_HOST="http://localhost:11434"
OLLAMA_MODEL="cniongolo/biomistral:latest"
OLLAMA_TIMEOUT="120000"
```

## 🛠️ Installation & Setup Commands

```bash
# 1. Install dependencies
bun install

# 2. Generate Prisma client
bun run db:generate

# 3. Push database schema
bun run db:push

# 4. Seed database with sample data
bunx prisma db seed

# 5. Start development server
bun run dev
```

## 📁 Project Structure

```
├── .env.example          # Environment template
├── .env.local            # Your local environment (create this)
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding script
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # UI components
│   └── lib/              # Utilities and providers
└── public/               # Static assets
```

## 🔧 Database Schema Overview

The application includes these main models:
- **User**: Authentication and profiles
- **Drug**: Medication database
- **Interaction**: Drug interaction checks
- **Patient**: Patient management
- **Course**: Educational content
- **Subscription**: Billing and plans

## 🚀 Running the Application

After setup, the application will be available at:
- **Main App**: http://localhost:5173
- **API Routes**: http://localhost:5173/api
- **Admin Panel**: http://localhost:5173/admin

## 🧪 Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun run test:watch

# Lint code
bun run lint
```

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Database connection string |
| `DIRECT_URL` | ✅ | Direct database connection |
| `NEXTAUTH_URL` | ✅ | NextAuth base URL |
| `NEXTAUTH_SECRET` | ✅ | NextAuth secret key |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public app URL |
| `IP_HASH_SALT` | ✅ | IP hashing salt |
| `OLLAMA_HOST` | ❌ | Ollama server URL |
| `OLLAMA_MODEL` | ❌ | AI model name |
| `OLLAMA_TIMEOUT` | ❌ | AI request timeout |

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running (if using PostgreSQL)
- Check that database credentials are correct
- Verify the database exists

### Authentication Issues
- Clear browser cookies and localStorage
- Ensure NEXTAUTH_SECRET is at least 32 characters
- Check that NEXTAUTH_URL matches your dev server

### Port Conflicts
- Default port is 5173
- Change with: `bun run dev -- -p 3000`

### Build Issues
- Run `bun run db:generate` before building
- Ensure all environment variables are set

## 🎯 Quick Start Summary

1. Run `setup.bat` (Windows) or `./setup.sh` (Mac/Linux)
2. Install dependencies: `bun install`
3. Setup database: `bun run db:push`
4. Seed data: `bunx prisma db seed`
5. Start server: `bun run dev`
6. Visit: http://localhost:5173

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Regularly update dependencies
- Enable HTTPS in production
- Use environment-specific secrets

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Verify all environment variables are set
3. Ensure database is running and accessible
4. Check the console for error messages

Happy coding! 🎉
