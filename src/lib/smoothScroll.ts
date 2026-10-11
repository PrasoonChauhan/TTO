import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

/**
 * Momentum scrolling (PRD §1). Low lerp = heavy, deliberate glide.
 * Lenis is driven by the GSAP ticker so ScrollTrigger and scroll share one clock.
 */
export function initSmoothScroll() {
  if (lenis) return lenis

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  lenis = new Lenis({
    lerp: reduced ? 0.25 : 0.07,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.4,
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis() {
  return lenis
}

export function destroySmoothScroll() {
  lenis?.destroy()
  lenis = null
}
