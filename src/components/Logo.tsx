interface LogoProps {
  variant?: 'full' | 'icon' | 'vertical' | 'monochrome'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  className?: string
}

const SIZE_MAP = {
  sm:  { icon: 32,  gap: 8,  name: 18, tagline: 9 },
  md:  { icon: 42,  gap: 10, name: 24, tagline: 11 },
  lg:  { icon: 54,  gap: 12, name: 30, tagline: 13 },
  xl:  { icon: 72,  gap: 16, name: 40, tagline: 15 },
}

/**
 * Rentiefy Icon SVG — Matches brand specification:
 * Blue House / "R" shape with 2×2 window grid and integrated teal location pin.
 */
export function RentIcon({
  size = 40,
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
  const pColor = pinColor || '#0D9488'
  const winColor = windowColor || (windowFill && windowFill !== '#2555EB' ? windowFill : '#0F172A')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="Rentiefy Logo Icon"
    >
      {/* Outer Blue House & Stylized 'R' Structure */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M250 40 
           L430 150 
           V250 
           C430 325 375 370 300 370 
           H280 
           L380 460 
           H305 
           L220 370 
           H195 
           V460 
           H130 
           V210 
           L250 115 
           Z
           M195 175
           L250 135
           L355 185
           V250
           C355 295 330 315 295 315
           H195
           V175
           Z"
        fill={mainColor}
      />

      {/* House Roof Top Overhang Edge */}
      <path
        d="M250 40 L445 160 L415 190 L250 85 L85 190 L55 160 Z"
        fill={mainColor}
      />

      {/* 2×2 Window Grid (4 square panes inside upper R loop) */}
      <rect x="222" y="195" width="22" height="22" rx="3" fill={winColor} />
      <rect x="252" y="195" width="22" height="22" rx="3" fill={winColor} />
      <rect x="222" y="225" width="22" height="22" rx="3" fill={winColor} />
      <rect x="252" y="225" width="22" height="22" rx="3" fill={winColor} />

      {/* Integrated Teal Location Pin at Bottom-Left Stem */}
      <path
        d="M165 290
           C120 290 85 325 85 370
           C85 425 165 475 165 475
           C165 475 245 425 245 370
           C245 325 210 290 165 290 Z"
        fill={pColor}
      />
      {/* Location Pin Center Hole */}
      <circle cx="165" cy="365" r="24" fill="#FFFFFF" />
    </svg>
  )
}

/**
 * Rentiefy Wordmark & Tagline Component
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
  const pinColor     = variant === 'monochrome' ? (isDark ? '#94A3B8' : '#0F172A') : '#0D9488'
  const windowColor  = variant === 'monochrome' ? (isDark ? '#0F172A' : '#FFFFFF') : '#0F172A'
  const nameColor    = isDark ? '#FFFFFF' : '#0F172A'
  const tagColor     = isDark ? '#94A3B8' : '#64748B'

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

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`} style={{ gap: d.gap }}>
        <RentIcon
          size={d.icon * 1.5}
          primaryColor={primaryColor}
          pinColor={pinColor}
          windowColor={windowColor}
        />
        <div className="flex flex-col items-center">
          <span
            className="font-extrabold tracking-tight"
            style={{ fontSize: d.name, color: nameColor, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Rentiefy
          </span>
          {showTagline && (
            <span
              className="font-bold tracking-widest uppercase mt-0.5"
              style={{ fontSize: d.tagline, color: tagColor, letterSpacing: '0.22em' }}
            >
              FIND. RENT. RELAX.
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
          className="font-extrabold tracking-tight"
          style={{ fontSize: d.name, color: nameColor, fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Rentiefy
        </span>
        {showTagline && (
          <span
            className="font-bold tracking-widest uppercase mt-1"
            style={{ fontSize: d.tagline, color: tagColor, letterSpacing: '0.2em' }}
          >
            FIND. RENT. RELAX.
          </span>
        )}
      </div>
    </div>
  )
}


