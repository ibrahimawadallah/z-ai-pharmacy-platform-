#!/bin/bash

# Minimal deployment script for DrugEye platform
echo "Starting minimal deployment..."

# Backup original files
cp package.json package.json.backup
cp next.config.js next.config.js.backup

# Use minimal configuration
cp package.minimal.json package.json
cp next.config.minimal.js next.config.js

# Clean install minimal dependencies
npm install --legacy-peer-deps

# Build with minimal configuration
npm run build

# Deploy to Vercel
vercel --prod

# Restore original files
cp package.json.backup package.json
cp next.config.js.backup next.config.js

echo "Minimal deployment completed!"
