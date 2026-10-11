import type { CSSProperties, ReactElement } from 'react'

/**
 * PLACEHOLDER LOGOS. Fictional marks drawn in SVG so the grid can be
 * reviewed. Swap each `mark` for a client's monochrome SVG (fill="currentColor").
 * `scale` balances optical weight: compact symbols render smaller than wordmarks.
 */
export type Brand = { name: string; caption: string; scale: number; mark: ReactElement }

const display: CSSProperties = { fontFamily: 'var(--font-display)' }
const body: CSSProperties = { fontFamily: 'var(--font-body)' }
const mono: CSSProperties = { fontFamily: 'var(--font-mono)' }

export const brandList: Brand[] = [
  {
    name: 'Lumen',
    caption: 'Lumen',
    scale: 0.78,
    mark: (
      <svg viewBox="0 0 170 60" fill="currentColor">
        <text x="0" y="46" style={{ ...body, fontWeight: 700, fontSize: 52 }} textLength="142" lengthAdjust="spacingAndGlyphs">
          lumen
        </text>
        <circle cx="160" cy="41" r="6.5" />
      </svg>
    ),
  },
  {
    name: 'Kepler Systems',
    caption: 'Kepler Systems',
    scale: 0.62,
    mark: (
      <svg viewBox="0 0 220 60" fill="currentColor">
        <text x="0" y="45" style={{ ...display, fontWeight: 800, fontStretch: '125%', fontSize: 38 }} textLength="220" lengthAdjust="spacingAndGlyphs">
          KEPLER
        </text>
      </svg>
    ),
  },
  {
    name: 'Arcfield',
    caption: 'Arcfield',
    scale: 0.9,
    mark: (
      <svg viewBox="0 0 60 60" fill="currentColor">
        <path d="M4 56 A52 52 0 0 1 56 4 L56 21 A35 35 0 0 0 21 56 Z" />
        <circle cx="45" cy="45" r="9" />
      </svg>
    ),
  },
  {
    name: 'Helix Bio',
    caption: 'Helix Bio',
    scale: 0.9,
    mark: (
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
        <path d="M14 6 C 50 20, 10 40, 46 54" />
        <path d="M46 6 C 10 20, 50 40, 14 54" />
      </svg>
    ),
  },
  {
    name: 'Nova Pay',
    caption: 'Nova Pay',
    scale: 0.72,
    mark: (
      <svg viewBox="0 0 182 60" fill="currentColor">
        <text x="0" y="49" style={{ ...display, fontWeight: 900, fontStretch: '110%', fontSize: 52 }} textLength="40" lengthAdjust="spacingAndGlyphs">
          N
        </text>
        <circle cx="66" cy="30.5" r="19" />
        <text x="92" y="49" style={{ ...display, fontWeight: 900, fontStretch: '110%', fontSize: 52 }} textLength="90" lengthAdjust="spacingAndGlyphs">
          VA
        </text>
      </svg>
    ),
  },
  {
    name: 'Parallax',
    caption: 'Parallax',
    scale: 0.9,
    mark: (
      <svg viewBox="0 0 60 60" fill="currentColor">
        <polygon points="10,6 52,6 44,18 2,18" />
        <polygon points="16,24 58,24 50,36 8,36" />
        <polygon points="10,42 52,42 44,54 2,54" />
      </svg>
    ),
  },
  {
    name: 'Quanta AI',
    caption: 'Quanta AI',
    scale: 0.9,
    mark: (
      <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="9">
        <circle cx="27" cy="27" r="19" />
        <line x1="39" y1="39" x2="55" y2="55" strokeLinecap="square" />
      </svg>
    ),
  },
  {
    name: 'Meridian',
    caption: 'Meridian Capital',
    scale: 0.6,
    mark: (
      <svg viewBox="0 0 220 60" fill="currentColor">
        <rect x="0" y="8" width="5" height="44" />
        <text x="20" y="41" style={{ ...mono, fontWeight: 500, fontSize: 30 }} textLength="198" lengthAdjust="spacingAndGlyphs">
          MERIDIAN
        </text>
      </svg>
    ),
  },
]
