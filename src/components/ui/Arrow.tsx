/** The site's diagonal arrow. Stroke follows currentColor. */
export function Arrow({ strokeWidth = 1.6 }: { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="square" aria-hidden="true">
      <path d="M4.5 11.5 L11.5 4.5" />
      <path d="M5.5 4.5 H11.5 V10.5" />
    </svg>
  )
}
