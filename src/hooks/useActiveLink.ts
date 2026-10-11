import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/gsap'

/** Pages that own a nav link, matched by path prefix. */
const PAGE_LINKS: [prefix: string, href: string][] = [
  ['/about', '/about/'],
  ['/work', '/work/'],
  ['/insights', '/insights/'],
]

/** Home sections that light a nav link while they fill the middle of the screen. */
const HOME_SECTIONS: [id: string, href: string][] = [
  ['work', '/work/'],
  ['services', '/#services'],
  ['process', '/#process'],
]

/**
 * The nav link that matches where the visitor is: the page they are on, or on
 * the home page, the section in the middle of the screen. Null when none.
 */
export function useActiveLink() {
  const path = window.location.pathname
  const page = PAGE_LINKS.find(([prefix]) => path.startsWith(prefix))?.[1] ?? null
  const [section, setSection] = useState<string | null>(null)

  useEffect(() => {
    if (page) return
    const triggers = HOME_SECTIONS.flatMap(([id, href]) => {
      const el = document.getElementById(id)
      if (!el) return []
      // Pinned sections are wrapped in a spacer; measure the spacer so the full pin counts.
      const host = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
      return [
        ScrollTrigger.create({
          trigger: host,
          start: 'top 50%',
          end: 'bottom 50%',
          refreshPriority: -1,
          onToggle: (self) => setSection((cur) => (self.isActive ? href : cur === href ? null : cur)),
        }),
      ]
    })
    return () => triggers.forEach((t) => t.kill())
  }, [page])

  return page ?? section
}
