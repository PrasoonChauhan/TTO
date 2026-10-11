import type { MouseEvent } from 'react'
import { getLenis } from './smoothScroll'

/**
 * Link handler shared by the nav and footer. Same-page anchors glide with
 * Lenis; anything on another page (e.g. "/#work" from /about/) navigates
 * normally and the destination page jumps to the hash on load.
 */
export function navigate(href: string, e: MouseEvent, after?: () => void) {
  after?.()
  const url = new URL(href, window.location.href)
  if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return
  const lenis = getLenis()
  if (!url.hash || url.hash === '#top') {
    e.preventDefault()
    lenis?.scrollTo(0, { duration: 2.4 })
    return
  }
  const target = document.querySelector<HTMLElement>(url.hash)
  if (!target) return
  e.preventDefault()
  lenis?.scrollTo(target, { duration: 1.8 })
}
