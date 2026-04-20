import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Z-AI Pharmacy Platform - AI Clinical Assistant'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '120px',
              marginRight: '20px',
            }}
          >
            💊
          </div>
        </div>
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.2,
          }}
        >
          Z-AI Pharmacy Platform
        </h1>
        <p
          style={{
            fontSize: '32px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginBottom: '40px',
            maxWidth: '800px',
          }}
        >
          AI-Powered Clinical Decision Support for UAE Healthcare Professionals
        </p>
        <div
          style={{
            display: 'flex',
            gap: '40px',
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <div>21,885+ Drugs</div>
          <div>•</div>
          <div>32 Diseases</div>
          <div>•</div>
          <div>AI Assistant</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
