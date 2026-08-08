interface LogoProps {
  variant?: 'full' | 'icon' | 'vertical' | 'stacked' | 'wordmark' | 'monochrome'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  className?: string
}

const SIZE_MAP = {
  sm:  { icon: 32,  gap: 8,  name: 18, tagline: 8.5 },
  md:  { icon: 42,  gap: 10, name: 24, tagline: 10.5 },
  lg:  { icon: 56,  gap: 12, name: 32, tagline: 12 },
  xl:  { icon: 76,  gap: 16, name: 42, tagline: 15 },
}

/**
 * Rentiefy Icon SVG — Exact match to official brand icon:
 * - Royal/Electric Blue (#2563EB) House / 'R' structure
 * - 4-Pane Dark (#0F172A) Window Grid inside roof arch
 * - Teal (#14B8A6) Location Map Pin with white center hole
 */
export function RentIcon({
  size = 42,
  primaryColor,
  pinColor,
  windowColor,
  houseFill,
  windowFill,
  className = '',
}: {
  size?: number
  primaryColor?: string
  pinColor?: string
  windowColor?: string
  houseFill?: string
  windowFill?: string
  className?: string
}) {
  const mainColor = primaryColor || houseFill || '#2563EB'
  const pColor = pinColor || '#14B8A6'
  const winColor = windowColor || windowFill || '#FFFFFF'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      fill="none"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-label="Rentiefy Logo Icon"
    >
      {/* Outer Blue House & Stylized 'R' Structure */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M250 40 
           L425 150 
           V235 
           C425 300 375 325 300 325 
           L415 440 
           H330 
           L230 325 
           H185 
           V440 
           H120 
           V200 
           L250 115 
           Z
           M185 168
           L250 128
           L345 185
           V235
           C345 270 315 280 280 280
           H185
           V168
           Z"
        fill={mainColor}
      />

      {/* 2×2 Window Grid inside upper roof arch */}
      <rect x="220" y="180" width="22" height="22" rx="4" fill={winColor} />
      <rect x="250" y="180" width="22" height="22" rx="4" fill={winColor} />
      <rect x="220" y="210" width="22" height="22" rx="4" fill={winColor} />
      <rect x="250" y="210" width="22" height="22" rx="4" fill={winColor} />

      {/* Teal Location Pin at Bottom-Left */}
      <path
        d="M200 270
           C150 270 110 310 110 360
           C110 420 200 480 200 480
           C200 480 290 420 290 360
           C290 310 250 270 200 270 Z"
        fill={pColor}
      />
      {/* Location Pin Center Hole */}
      <circle cx="200" cy="355" r="26" fill="#FFFFFF" />
    </svg>
  )
}

/**
 * Rentiefy Wordmark & Tagline Component — Exact match to official brand guidelines
 */
export default function Logo({
  variant = 'full',
  theme = 'light',
  size = 'md',
  showTagline = true,
  className = '',
}: LogoProps) {
  const d = SIZE_MAP[size]
  const isDark = theme === 'dark'

  const primaryColor = variant === 'monochrome' ? (isDark ? '#FFFFFF' : '#0F172A') : '#2563EB'
  const pinColor     = variant === 'monochrome' ? (isDark ? '#94A3B8' : '#0F172A') : '#14B8A6'
  const windowColor  = variant === 'monochrome' ? (isDark ? '#0F172A' : '#FFFFFF') : '#FFFFFF'
  const nameColor    = isDark ? '#FFFFFF' : '#0F172A'
  const tagColor     = isDark ? '#94A3B8' : '#64748B'
  const dotColor     = variant === 'monochrome' ? nameColor : '#14B8A6'

  if (variant === 'icon') {
    return (
      <RentIcon
        size={d.icon}
        primaryColor={primaryColor}
        pinColor={pinColor}
        windowColor={windowColor}
        className={className}
      />
    )
  }

  if (variant === 'wordmark') {
    return (
      <div className={`flex flex-col justify-center leading-none ${className}`}>
        <span
          className="font-extrabold tracking-tight select-none leading-none"
          style={{ fontSize: d.name, color: nameColor, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          Rent
          <span className="relative inline-block">
            i
            <span
              className="absolute rounded-full pointer-events-none"
              style={{
                backgroundColor: dotColor,
                width: '0.24em',
                height: '0.24em',
                top: '0.06em',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </span>
          efy
        </span>
        {showTagline && (
          <span
            className="font-bold tracking-widest uppercase mt-1 flex items-center"
            style={{ fontSize: d.tagline, color: tagColor, letterSpacing: '0.2em' }}
          >
            FIND. RENT. RELAX<span style={{ color: dotColor }}>.</span>
          </span>
        )}
      </div>
    )
  }

  if (variant === 'vertical' || variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`} style={{ gap: d.gap }}>
        <RentIcon
          size={d.icon * 1.3}
          primaryColor={primaryColor}
          pinColor={pinColor}
          windowColor={windowColor}
        />
        <div className="flex flex-col items-center leading-none">
          <span
            className="font-extrabold tracking-tight select-none leading-none"
            style={{ fontSize: d.name, color: nameColor, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Rent
            <span className="relative inline-block">
              i
              <span
                className="absolute rounded-full pointer-events-none"
                style={{
                  backgroundColor: dotColor,
                  width: '0.24em',
                  height: '0.24em',
                  top: '0.06em',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
            </span>
            efy
          </span>
          {showTagline && (
            <span
              className="font-bold tracking-widest uppercase mt-1"
              style={{ fontSize: d.tagline, color: tagColor, letterSpacing: '0.2em' }}
            >
              FIND. RENT. RELAX<span style={{ color: dotColor }}>.</span>
            </span>
          )}
        </div>
      </div>
    )
  }

  // 'full' — Horizontal layout
  return (
    <div className={`flex items-center ${className}`} style={{ gap: d.gap }}>
      <RentIcon
        size={d.icon}
        primaryColor={primaryColor}
        pinColor={pinColor}
        windowColor={windowColor}
      />
      <div className="flex flex-col justify-center leading-none">
        <span
          className="font-extrabold tracking-tight select-none leading-none"
          style={{ fontSize: d.name, color: nameColor, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          Rent
          <span className="relative inline-block">
            i
            <span
              className="absolute rounded-full pointer-events-none"
              style={{
                backgroundColor: dotColor,
                width: '0.24em',
                height: '0.24em',
                top: '0.06em',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          </span>
          efy
        </span>
        {showTagline && (
          <span
            className="font-bold tracking-widest uppercase mt-1"
            style={{ fontSize: d.tagline, color: tagColor, letterSpacing: '0.2em' }}
          >
            FIND. RENT. RELAX<span style={{ color: dotColor }}>.</span>
          </span>
        )}
      </div>
    </div>
  )
}




