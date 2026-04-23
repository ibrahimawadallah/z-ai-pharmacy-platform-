import * as React from 'react'

export type LogoMarkTone = 'brand' | 'mono-light' | 'mono-dark'

interface LogoMarkProps extends React.SVGProps<SVGSVGElement> {
  tone?: LogoMarkTone
  title?: string
}

/**
 * DrugEye trademark mark.
 *
 * Composition (trademark-ready, geometric construction on a 240x160 grid):
 *  - Outlined almond eye (dark teal)  -> vision / clinical insight
 *  - Vertical capsule inside the eye  -> medication (top darker teal, bottom light mint)
 *  - Orange eye-drop floating at top-right  -> ophthalmic / pharmaceutical delivery
 */
export function LogoMark({
  tone = 'brand',
  title = 'DrugEye',
  ...props
}: LogoMarkProps) {
  const uid = React.useId().replace(/:/g, '')
  const dropId = `de-drop-${uid}`
  const pillTopId = `de-pill-top-${uid}`
  const pillBotId = `de-pill-bot-${uid}`

  const isMonoLight = tone === 'mono-light'
  const isMonoDark = tone === 'mono-dark'

  const eyeStroke = isMonoLight ? '#0f172a' : isMonoDark ? '#ffffff' : '#0f766e'
  const pillOutline = isMonoLight
    ? '#0f172a'
    : isMonoDark
      ? '#ffffff'
      : '#115e59'
  const pillTopFill = isMonoLight
    ? '#0f172a'
    : isMonoDark
      ? '#ffffff'
      : `url(#${pillTopId})`
  const pillBotFill = isMonoLight
    ? '#ffffff'
    : isMonoDark
      ? '#0f172a'
      : `url(#${pillBotId})`
  const pillSplit = isMonoLight ? '#0f172a' : isMonoDark ? '#ffffff' : '#115e59'
  const dropFill = isMonoLight
    ? '#0f172a'
    : isMonoDark
      ? '#ffffff'
      : `url(#${dropId})`
  const dropStroke = isMonoLight
    ? 'transparent'
    : isMonoDark
      ? 'transparent'
      : '#c2410c'

  return (
    <svg
      viewBox="0 0 240 160"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      {...props}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={pillTopId} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id={pillBotId} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="100%" stopColor="#5eead4" />
        </linearGradient>
        <linearGradient id={dropId} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>

      {/* Almond eye outline */}
      <path
        d="M 20 80 C 50 20, 190 20, 220 80 C 190 140, 50 140, 20 80 Z"
        fill="none"
        stroke={eyeStroke}
        strokeWidth="8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Vertical capsule (pill) — rounded stadium, split in half */}
      <g>
        {/* Top (darker) half */}
        <path
          d="M 102 50 A 18 18 0 0 1 138 50 L 138 80 L 102 80 Z"
          fill={pillTopFill}
          stroke={pillOutline}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Bottom (light mint) half */}
        <path
          d="M 102 80 L 138 80 L 138 110 A 18 18 0 0 1 102 110 Z"
          fill={pillBotFill}
          stroke={pillOutline}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Split line reinforcing the pill seam */}
        <line
          x1="101"
          y1="80"
          x2="139"
          y2="80"
          stroke={pillSplit}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Subtle highlight on the top half */}
        {!isMonoLight && !isMonoDark && (
          <path
            d="M 108 55 Q 114 48 122 50"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </g>

      {/* Orange eye-drop (top-right) */}
      <g transform="translate(192 14) rotate(-6 12 40)">
        <path
          d="M 12 0 C 12 0, -6 30, -6 48 A 18 18 0 0 0 30 48 C 30 30, 12 0, 12 0 Z"
          fill={dropFill}
          stroke={dropStroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {!isMonoLight && !isMonoDark && (
          <ellipse
            cx="4"
            cy="42"
            rx="4"
            ry="7"
            fill="rgba(255,255,255,0.45)"
          />
        )}
      </g>
    </svg>
  )
}

export default LogoMark
