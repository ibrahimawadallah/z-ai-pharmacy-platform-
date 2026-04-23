import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

/**
 * Browser-tab favicon: the DrugEye mark optimised for very small sizes.
 * The outlined eye is dropped at this scale so the pill + drop are the
 * recognisable silhouette, and the whole thing sits on a soft rounded
 * teal square for high contrast on both light and dark tabs.
 */
export default function Icon() {
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
            'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 55%, #99f6e4 100%)',
          borderRadius: 14,
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Capsule */}
          <path
            d="M 22 18 A 10 10 0 0 1 42 18 L 42 34 L 22 34 Z"
            fill="#0f766e"
          />
          <path
            d="M 22 34 L 42 34 L 42 50 A 10 10 0 0 1 22 50 Z"
            fill="#5eead4"
          />
          <line
            x1="22"
            y1="34"
            x2="42"
            y2="34"
            stroke="#115e59"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Orange drop */}
          <path
            d="M 54 10 C 54 10, 46 22, 46 30 A 8 8 0 0 0 62 30 C 62 22, 54 10, 54 10 Z"
            fill="#f97316"
            stroke="#c2410c"
            strokeWidth="1"
          />
        </svg>
      </div>
    ),
    { ...size },
  )
}
