import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

/** One clock for label and arrow so they always travel in sync. */
export const ROLL = { duration: 0.5, ease: 'power2.inOut' }

/**
 * Slot-reel hover shared by every CTA. The label reel rolls up one line and
 * the arrow reel rolls one tile toward its head. Mouse-out reverses exactly.
 */
export function useRoll<L extends HTMLElement = HTMLSpanElement, A extends HTMLElement = HTMLSpanElement>() {
  const roll = useRef<L>(null)
  const arrows = useRef<A>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const t = gsap.timeline({ paused: true, defaults: ROLL })
    // Either reel is optional (e.g. an icon-only button has no label).
    if (roll.current) t.to(roll.current, { yPercent: -100 }, 0)
    if (arrows.current) t.to(arrows.current, { xPercent: 100, yPercent: -100 }, 0)
    tl.current = t
    return () => {
      t.kill()
    }
  }, [])

  return {
    roll,
    arrows,
    enter: () => tl.current?.play(),
    leave: () => tl.current?.reverse(),
  }
}
