import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE } from '../../lib/gsap'
import { getLenis } from '../../lib/smoothScroll'
import { navigate } from '../../lib/navigate'
import { useActiveLink } from '../../hooks/useActiveLink'
import { MagneticButton } from '../ui/MagneticButton'
import { nav } from '../../content/copy'
import './Nav.css'

/**
 * A. Navigation - The Command Module (PRD §4A)
 * Fixed, full width, minimal padding. Brand left, link cluster centre, CTA right.
 */
export function Nav() {
  const root = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLUListElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  // Entrance: the command module powers on as the hero headline lands.
  useGSAP(
    () => {
      gsap.from('.nav__item', {
        yPercent: -120,
        opacity: 0,
        duration: 1.1,
        ease: EASE.reveal,
        stagger: 0.06,
        delay: 1.1,
      })
    },
    { scope: root },
  )

  // Glassmorphism appears only while a [data-nav-glass] element is beneath the nav.
  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>('[data-nav-glass]')
    const active = new Set<HTMLElement>()
    const sync = () => root.current?.classList.toggle('nav--glass', active.size > 0)
    els.forEach((el) =>
      ScrollTrigger.create({
        trigger: el,
        // Optional custom start, e.g. data-nav-glass="top bottom" to engage as soon as
        // the element begins pushing earlier content up under the nav.
        start: () => el.dataset.navGlass || `top top+=${root.current?.offsetHeight ?? 64}`,
        end: 'bottom top',
        // Measure after the hero pin has added its scroll distance.
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) active.add(el)
          else active.delete(el)
          sync()
        },
      }),
    )
  })

  // Link hover: the hovered link holds, its siblings dim to 0.4.
  useEffect(() => {
    const list = linksRef.current
    if (!list) return
    const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('.nav__link'))
    const onEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      links.forEach((l) =>
        gsap.to(l, { opacity: l === target ? 1 : 0.4, duration: 0.45, ease: EASE.move, overwrite: 'auto' }),
      )
    }
    const onLeave = () => gsap.to(links, { opacity: 1, duration: 0.5, ease: EASE.move, overwrite: 'auto' })
    links.forEach((l) => l.addEventListener('mouseenter', onEnter))
    list.addEventListener('mouseleave', onLeave)
    return () => {
      links.forEach((l) => l.removeEventListener('mouseenter', onEnter))
      list.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  /* ---------- Where we are: the moon dot under the active link ---------- */
  const active = useActiveLink()
  const dot = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const list = linksRef.current
    const d = dot.current
    if (!list || !d) return
    const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('.nav__link'))
    const current = () => links.find((l) => l.getAttribute('href') === active) ?? null
    // Glide the dot under a link (or fade it out when nothing is active).
    const moveTo = (link: HTMLElement | null, instant = false) => {
      const dur = instant ? 0 : 0.7
      if (!link) {
        gsap.to(d, { autoAlpha: 0, scale: 0, duration: instant ? 0 : 0.4, ease: EASE.move, overwrite: 'auto' })
        return
      }
      // Measure against the list: each link sits in its own (transformed) wrapper.
      const lr = link.getBoundingClientRect()
      const x = lr.left - list.getBoundingClientRect().left + lr.width / 2
      const visible = Number(gsap.getProperty(d, 'opacity')) > 0.05
      if (!visible) gsap.set(d, { x })
      gsap.to(d, { x, autoAlpha: 1, scale: 1, duration: dur, ease: 'power3.inOut', overwrite: 'auto' })
    }
    moveTo(current(), true)
    let hovered: HTMLElement | null = null
    const onEnter = (e: Event) => moveTo((hovered = e.currentTarget as HTMLElement))
    const onLeave = () => {
      hovered = null
      moveTo(current())
    }
    // Re-measure on resize, keeping the dot under a hovered link if there is one.
    const onResize = () => moveTo(hovered ?? current(), true)
    links.forEach((l) => l.addEventListener('mouseenter', onEnter))
    list.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(onResize)
    return () => {
      links.forEach((l) => l.removeEventListener('mouseenter', onEnter))
      list.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [active])

  // Mobile overlay.
  const wasOpen = useRef(false)
  useEffect(() => {
    const el = overlay.current
    if (!el || wasOpen.current === open) return
    wasOpen.current = open
    const lenis = getLenis()
    if (open) {
      lenis?.stop()
      gsap.set(el, { visibility: 'visible' })
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: EASE.inOut })
      gsap.fromTo(
        el.querySelectorAll('.line-inner'),
        { yPercent: 120 },
        { yPercent: 0, duration: 1, ease: EASE.reveal, stagger: 0.05, delay: 0.25 },
      )
    } else {
      lenis?.start()
      gsap.to(el, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.6,
        ease: EASE.inOut,
        onComplete: () => {
          gsap.set(el, { visibility: 'hidden' })
        },
      })
    }
  }, [open])

  const go = (href: string) => (e: ReactMouseEvent) => navigate(href, e, () => setOpen(false))

  return (
    <>
      <header className="nav" ref={root}>
        <a href="/#top" className="nav__brand nav__item" aria-label="The Third Orbit, home" onClick={go('/#top')}>
          <img className="nav__logo nav__logo--dark" src="/logos/tto_black_logo.png" alt="" width={870} height={393} />
          <img className="nav__logo nav__logo--light" src="/logos/tto_white_logo.png" alt="" width={435} height={197} />
        </a>

        <nav aria-label="Primary" className="nav__center">
          <ul className="nav__links" ref={linksRef}>
            {nav.links.map((l) => (
              <li key={l.href} className="nav__item">
                <a
                  className={`nav__link${active === l.href ? ' is-active' : ''}`}
                  href={l.href}
                  onClick={go(l.href)}
                  aria-current={active === l.href ? (l.href.includes('#') ? 'location' : 'page') : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <span className="nav__orbit-dot" ref={dot} aria-hidden="true" />
          </ul>
        </nav>

        <div className="nav__right">
          <div className="nav__item nav__cta">
            <MagneticButton href={nav.cta.href} label={nav.cta.label} external={nav.cta.external} />
          </div>
          <button
            className="nav__item nav__menu"
            aria-expanded={open}
            aria-controls="nav-overlay"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <div className="nav-overlay" id="nav-overlay" ref={overlay} aria-hidden={!open} data-open={open}>
        <ul>
          {[...nav.links, nav.cta].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={go(l.href)}
                tabIndex={open ? 0 : -1}
                aria-current={active === l.href ? 'page' : undefined}
                className="display"
                {...('external' in l && l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="line-mask">
                  <span className="line-inner">{l.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
