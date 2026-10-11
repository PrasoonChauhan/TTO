import { gsap } from './gsap'
import { resolveNavTheme, type NavTheme } from './theme'

const PALETTE = {
  light: { bg: '#F4F4F5', ink: '#111111' },
  dark: { bg: '#0A0A0A', ink: '#FAFAFA' },
}

/** The section rendered just before `host`, looking through <main> and pin wrappers. */
function previousSection(host: HTMLElement): HTMLElement | null {
  let prev = host.previousElementSibling as HTMLElement | null
  if (prev?.tagName === 'MAIN') prev = prev.lastElementChild as HTMLElement | null
  if (prev?.classList.contains('pin-spacer')) prev = prev.firstElementChild as HTMLElement | null
  return prev
}

/** True when the element already paints a dark surface (luminance of its background). */
function isDark(el: HTMLElement) {
  const m = getComputedStyle(el).backgroundColor.match(/\d+(\.\d+)?/g)
  if (!m) return false
  const [r, g, b] = m.map(Number)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128
}

/**
 * Whole-screen surface change between two sections (PRD: daylight to void and
 * back). As `section` scrolls in, its --s-bg / --s-ink channels and the previous
 * section's background move together, and the previous section's content
 * dissolves, so there is never a hard edge. The nav flips at the midpoint.
 * If the previous section already shows the target surface, nothing animates.
 */
export function surfaceCrossfade(section: HTMLElement, to: NavTheme) {
  const from: NavTheme = to === 'light' ? 'dark' : 'light'
  const host = section.parentElement?.classList.contains('pin-spacer') ? section.parentElement : section
  const prev = previousSection(host)

  if (!prev || isDark(prev) === (to === 'dark')) {
    gsap.set(section, { '--s-bg': PALETTE[to].bg, '--s-ink': PALETTE[to].ink })
    return null
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none', duration: 1 },
    scrollTrigger: { trigger: host, start: 'top 85%', end: 'top 20%', scrub: true },
    onUpdate: () => {
      prev.dataset.surface = tl.progress() > 0.5 ? to : from
      resolveNavTheme()
    },
  })
  tl.fromTo(
    section,
    { '--s-bg': PALETTE[from].bg, '--s-ink': PALETTE[from].ink },
    { '--s-bg': PALETTE[to].bg, '--s-ink': PALETTE[to].ink },
    0,
  )
    .fromTo(prev, { backgroundColor: PALETTE[from].bg }, { backgroundColor: PALETTE[to].bg }, 0)
    .to(Array.from(prev.children), { opacity: 0, duration: 0.6 }, 0)
  return tl
}
