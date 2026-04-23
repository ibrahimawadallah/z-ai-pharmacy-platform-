import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 60%, #5eead4 100%)',
          borderRadius: 40,
        }}
      >
        <svg
          width="150"
          height="100"
          viewBox="0 0 240 160"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 20 80 C 50 20, 190 20, 220 80 C 190 140, 50 140, 20 80 Z"
            fill="none"
            stroke="#0f766e"
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M 102 50 A 18 18 0 0 1 138 50 L 138 80 L 102 80 Z"
            fill="#0f766e"
            stroke="#115e59"
            strokeWidth="2.5"
          />
          <path
            d="M 102 80 L 138 80 L 138 110 A 18 18 0 0 1 102 110 Z"
            fill="#5eead4"
            stroke="#115e59"
            strokeWidth="2.5"
          />
          <line
            x1="101"
            y1="80"
            x2="139"
            y2="80"
            stroke="#115e59"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <g transform="translate(192 14) rotate(-6 12 40)">
            <path
              d="M 12 0 C 12 0, -6 30, -6 48 A 18 18 0 0 0 30 48 C 30 30, 12 0, 12 0 Z"
              fill="#f97316"
              stroke="#c2410c"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>
    ),
    { ...size },
  )
}
