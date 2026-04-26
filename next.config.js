/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  serverExternalPackages: [
    'sharp',
    'groq-sdk',
    '@ai-sdk/groq',
    '@ai-sdk/openai',
    'ai',
    'ollama',
    'nodemailer',
    'jspdf',
    'jspdf-autotable',
    'postgres',
    'csv-parse',
    '@mdxeditor/editor'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
  },
}

module.exports = nextConfig