import { useEffect, type RefObject } from 'react'
import { gsap, EASE } from '../lib/gsap'

type Options = {
  /** How far (0-1) the element follows the cursor offset. */
  strength?: number
  /** Hard cap on travel in px, so the pull stays a hint rather than a lurch. */
  max?: number
  /** Extra px around the bounding box that counts as the "gravity well". */
  field?: number
}

/**
 * Magnetic gravitational hover (PRD §3).
 * Inside the field, the element leans toward the cursor. On exit it
 * settles back to 0,0 with a soft spring.
 */
export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  { strength = 0.12, max = 4, field = 16 }: Options = {},
) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    const clamp = gsap.utils.clamp(-max, max)
    let inside = false

    const release = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: EASE.spring, overwrite: 'auto' })

    const onMove = (e: MouseEvent) => {
      // Measure the untransformed box so the pull doesn't feed back on itself.
      const r = el.getBoundingClientRect()
      const left = r.left - (Number(gsap.getProperty(el, 'x')) || 0)
      const top = r.top - (Number(gsap.getProperty(el, 'y')) || 0)
      const within =
        e.clientX > left - field && e.clientX < left + r.width + field &&
        e.clientY > top - field && e.clientY < top + r.height + field

      if (within) {
        inside = true
        const dx = e.clientX - (left + r.width / 2)
        const dy = e.clientY - (top + r.height / 2)
        gsap.to(el, { x: clamp(dx * strength), y: clamp(dy * strength), duration: 0.5, ease: EASE.move, overwrite: 'auto' })
      } else if (inside) {
        inside = false
        release()
      }
    }

    const onLeaveWindow = () => {
      if (!inside) return
      inside = false
      release()
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeaveWindow)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeaveWindow)
      gsap.killTweensOf(el)
    }
  }, [ref, strength, max, field])
}
