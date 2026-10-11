import type { MouseEvent as ReactMouseEvent } from 'react'
import { useRoll } from '../../hooks/useRoll'
import { Arrow } from './Arrow'
import './MagneticButton.css'

type Props = {
  href: string
  label: string
  size?: 'sm' | 'lg'
  className?: string
  onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void
  /** Opens in a new tab (WhatsApp, other sites). */
  external?: boolean
}

/**
 * Primary CTA. Colours never change. On hover, label and arrow roll like a
 * slot reel: the label exits upward and its twin rises from below, while the
 * arrow exits toward its head and its twin enters from the opposite corner.
 * Mouse-out plays the exact reverse. Both settle where they started.
 */
export function MagneticButton({ href, label, size = 'sm', className = '', onClick, external = false }: Props) {
  const { roll, arrows, enter, leave } = useRoll()

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`mbtn mbtn--${size} ${className}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      onClick={onClick}
      aria-label={label}
    >
      <span className="mbtn__label" aria-hidden="true">
        <span className="mbtn__roll" ref={roll}>
          <span className="mbtn__text">{label}</span>
          <span className="mbtn__text mbtn__text--twin">{label}</span>
        </span>
      </span>
      <span className="mbtn__tile" aria-hidden="true">
        <span className="mbtn__arrows" ref={arrows}>
          <span className="mbtn__arrow">
            <Arrow />
          </span>
          <span className="mbtn__arrow mbtn__arrow--twin">
            <Arrow />
          </span>
        </span>
      </span>
    </a>
  )
}
