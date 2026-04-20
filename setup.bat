@echo off
REM Z-AI Pharmacy Platform - Environment Setup Script for Windows
echo 🚀 Setting up Z-AI Pharmacy Platform...

REM Check if .env.local exists
if exist .env.local (
    echo ⚠️  .env.local already exists. Skipping creation.
) else (
    echo 📝 Creating .env.local from .env.example...
    copy .env.example .env.local >nul
    echo ✅ .env.local created successfully!
)

REM Generate NextAuth secret (using PowerShell)
echo 🔐 Generating NextAuth secret...
for /f "delims=" %%i in ('powershell -Command "openssl rand -base64 32"') do set SECRET=%%i
powershell -Command "(Get-Content .env.local) -replace 'YOUR_LONG_RANDOM_SECRET', '%SECRET%' | Set-Content .env.local"
echo ✅ NextAuth secret generated!

REM Generate IP hash salt
echo 🧂 Generating IP hash salt...
for /f "delims=" %%i in ('powershell -Command "openssl rand -base64 16"') do set SALT=%%i
powershell -Command "(Get-Content .env.local) -replace 'YOUR_RANDOM_SALT', '%SALT%' | Set-Content .env.local"
echo ✅ IP hash salt generated!

REM Update URLs for local development
echo 🌐 Updating URLs for local development...
powershell -Command "(Get-Content .env.local) -replace 'https://YOUR_VERCEL_DOMAIN', 'http://localhost:5173' | Set-Content .env.local"

REM Update database for SQLite (easier for local dev)
echo 💾 Setting up SQLite database...
powershell -Command "(Get-Content .env.local) -replace 'DATABASE_URL=\"prisma\+postgres://accelerate.prisma-data.net/\?api_key=YOUR_ACCELERATE_API_KEY\"', 'DATABASE_URL=\"file:./dev.db\"' | Set-Content .env.local"
powershell -Command "(Get-Content .env.local) -replace 'DIRECT_URL=\"postgres://USER:PASSWORD@db.prisma.io:5432/postgres\?sslmode=require\"', 'DIRECT_URL=\"file:./dev.db\"' | Set-Content .env.local"

echo.
echo 🎉 Environment setup complete!
echo.
echo 📋 Next steps:
echo    1. Install dependencies: bun install
echo    2. Setup database: bun run db:push
echo    3. Seed data: bunx prisma db seed
echo    4. Start dev server: bun run dev
echo.
echo 🌍 Your app will be available at: http://localhost:5173
echo.
echo 📝 Note: You can customize the .env.local file if needed.
pause
