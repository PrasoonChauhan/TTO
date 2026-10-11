import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSmoothScroll } from './lib/smoothScroll'
import { initThemeResolver } from './lib/theme'
import { ScrollTrigger } from './lib/gsap'

/** Shared page bootstrap: smooth scroll, nav theming, deep links. */
export function boot(page: ReactNode) {
  // Every visit starts at the top unless a section was linked directly.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)

  // Lenis must exist before components mount so they can pause/resume it.
  const lenis = initSmoothScroll()
  initThemeResolver(lenis)

  createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>)

  // Web fonts change line widths and heights: re-measure, then honour any #hash.
  const settle = () =>
    document.fonts.ready.then(() =>
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        const hash = window.location.hash
        if (!hash || hash === '#top') return
        const el = document.querySelector<HTMLElement>(hash)
        if (!el) return
        // Lenis caches the page height; re-measure before jumping or it clamps to 0.
        lenis.resize()
        const y = el.getBoundingClientRect().top + window.scrollY
        window.scrollTo(0, y)
        lenis.scrollTo(y, { immediate: true, force: true })
      }),
    )
  if (document.readyState === 'complete') settle()
  else window.addEventListener('load', settle, { once: true })
}
