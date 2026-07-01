import { ImageResponse } from 'next/og'

export function createOgImage({
  title,
  subtitle,
  accent = '#0ea5e9',
}: {
  title: string
  subtitle?: string
  accent?: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0d0d0d',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Brand wordmark */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: accent,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          IMMORALIA
        </div>

        {/* Title */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            fontSize: title.length > 50 ? 44 : 56,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            maxWidth: 900,
            marginTop: 32,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: 22,
              color: '#9ca3af',
              marginBottom: 32,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: accent,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
