  /** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
  typescript: {
    ignoreBuildErrors: true,
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
  },
}

module.exports = nextConfig
