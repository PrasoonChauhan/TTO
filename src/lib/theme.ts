import type Lenis from 'lenis'
import { ScrollTrigger } from './gsap'

/**
 * Nav theme channel. Sections register a "zone" with the surface they show.
 * On every scroll the resolver finds the zone under the nav's midline, so the
 * nav is always right, even after jumps (anchor links, fast flicks, refresh).
 */
export type NavTheme = 'light' | 'dark'
type Zone = { el: HTMLElement; theme: NavTheme | (() => NavTheme) }

const zones: Zone[] = []
const NAV_MID = 34

export function setNavTheme(theme: NavTheme) {
  const root = document.documentElement
  if (root.dataset.navTheme !== theme) root.dataset.navTheme = theme
}

export function resolveNavTheme() {
  for (const z of zones) {
    const r = z.el.getBoundingClientRect()
    if (r.top <= NAV_MID && r.bottom > NAV_MID) {
      // A crossfade can repaint a section mid-scroll; it reports that via data-surface.
      const surface = z.el.dataset.surface as NavTheme | undefined
      setNavTheme(surface ?? (typeof z.theme === 'function' ? z.theme() : z.theme))
      return
    }
  }
}

export function registerThemeZone(el: HTMLElement, theme: Zone['theme']) {
  const zone = { el, theme }
  zones.push(zone)
  requestAnimationFrame(resolveNavTheme)
  return () => {
    const i = zones.indexOf(zone)
    if (i > -1) zones.splice(i, 1)
  }
}

export function initThemeResolver(lenis: Lenis) {
  lenis.on('scroll', resolveNavTheme)
  window.addEventListener('scroll', resolveNavTheme, { passive: true })
  ScrollTrigger.addEventListener('refresh', resolveNavTheme)
  window.addEventListener('resize', resolveNavTheme)
}
