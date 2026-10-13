import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { gsap, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { useRoll } from '../../hooks/useRoll'
import { navigate } from '../../lib/navigate'
import { leadFormLink } from '../../lib/leadForm'
import { Arrow } from '../ui/Arrow'
import { footer } from '../../content/copy'
import { ICONS } from './brandIcons'
import './Footer.css'

type IconKey = keyof typeof ICONS

function BrandIcon({ name }: { name: IconKey }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  )
}

/** One big navigation row: label and diagonal arrow roll together on hover. */
function FooterLink({ label, href }: { label: string; href: string }) {
  const { roll, arrows, enter, leave } = useRoll()
  // `#start` / `#start-<source>` opens the lead form, like every other start button.
  const lead = href.startsWith('#start') ? leadFormLink(href.replace(/^#start-?/, '') || 'start') : null
  return (
    <li className="flink">
      <a
        href={href}
        className="flink__a"
        onMouseEnter={enter}
        onMouseLeave={leave}
        onFocus={enter}
        onBlur={leave}
        onClick={(e) => (lead ? lead.onClick(e) : navigate(href, e))}
      >
        <span className="flink__reel" aria-hidden="true">
          <span className="flink__roll" ref={roll}>
            <span className="display">{label}</span>
            <span className="display flink__twin">{label}</span>
          </span>
        </span>
        <span className="sr-only">{label}</span>
        <span className="flink__tile" aria-hidden="true">
          <span className="flink__arrows" ref={arrows}>
            <span className="flink__arrow">
              <Arrow strokeWidth={1.4} />
            </span>
            <span className="flink__arrow flink__arrow--twin">
              <Arrow strokeWidth={1.4} />
            </span>
          </span>
        </span>
      </a>
    </li>
  )
}

function useClock(timeZone: string) {
  const fmt = () => {
    const now = new Date()
    return {
      time: new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now),
      date: new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(now),
    }
  }
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 1000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return t
}

/**
 * Footer, shared by every page. Lives in the void: navigation, studio details,
 * socials, Ask AI, a live studio clock and the wordmark sign-off.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null)
  const top = useRoll()
  const clock = useClock(footer.clock.timeZone)
  const [toast, setToast] = useState<string | null>(null)
  useSectionTheme(root, 'dark')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.set(q('.flink__a'), { yPercent: 40, autoAlpha: 0 })
      gsap.set(q('.flink'), { '--rule': 0 })
      gsap.set(q('.footer .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.footer__wordmark-inner'), { yPercent: 105 })
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', toggleActions: 'play none none none' } })
        .to(q('.flink'), { '--rule': 1, duration: 1.1, stagger: 0.06, ease: EASE.inOut }, 0)
        .to(q('.flink__a'), { yPercent: 0, autoAlpha: 1, duration: 1, stagger: 0.06, ease: EASE.reveal }, 0.1)
        .to(q('.footer .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, ease: EASE.move }, 0.3)
      gsap.to(q('.footer__wordmark-inner'), {
        yPercent: 0,
        duration: 1.4,
        ease: EASE.reveal,
        scrollTrigger: { trigger: q('.footer__wordmark')[0], start: 'top 95%', toggleActions: 'play none none none' },
      })

      /* Hover: the focused row holds, siblings dim. */
      if (window.matchMedia('(hover: none)').matches) return
      const list = q('.footer__links')[0] as HTMLElement
      const rows = q('.flink__a') as HTMLElement[]
      const quick = { duration: 0.4, ease: EASE.move, overwrite: 'auto' as const }
      const onEnter = (e: Event) => rows.forEach((r) => gsap.to(r, { opacity: r === e.currentTarget ? 1 : 0.35, ...quick }))
      const onLeave = () => gsap.to(rows, { opacity: 1, ...quick })
      rows.forEach((r) => r.addEventListener('mouseenter', onEnter))
      list.addEventListener('mouseleave', onLeave)
      return () => {
        rows.forEach((r) => r.removeEventListener('mouseenter', onEnter))
        list.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: root },
  )

  /* Wordmark always spans the full content width. */
  useEffect(() => {
    const el = root.current?.querySelector<HTMLElement>('.footer__wordmark')
    const text = el?.querySelector<HTMLElement>('.footer__wordmark-inner')
    if (!el || !text) return
    const fit = () => {
      text.style.fontSize = '100px'
      const ratio = el.clientWidth / text.scrollWidth
      text.style.fontSize = `${Math.floor(100 * ratio * 0.995)}px`
    }
    fit()
    document.fonts.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const askAI = (url: string, label: string) => (e: MouseEvent) => {
    e.preventDefault()
    navigator.clipboard?.writeText(footer.ai.prompt).catch(() => {})
    window.open(url, '_blank', 'noopener')
    setToast(`Prompt copied. If ${label} opens empty, just paste it.`)
    window.setTimeout(() => setToast(null), 3600)
  }

  const year = new Date().getFullYear()
  const encoded = encodeURIComponent(footer.ai.prompt)

  return (
    <footer className="footer" id="footer" ref={root}>
      <div className="footer__grid">
        <nav className="footer__nav" aria-label="Footer">
          <p className="footer__label fade-up">
            <span className="footer__dot" aria-hidden="true" />
            Navigation
          </p>
          <ul className="footer__links">
            {footer.links.map((l) => (
              <FooterLink key={l.href} {...l} />
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <div className="footer__block fade-up">
            <p className="eyebrow footer__eyebrow">(Studio)</p>
            <a className="footer__email" href={`mailto:${footer.email}`}>
              <span aria-hidden="true">↳</span>
              {footer.email}
            </a>
            <p className="footer__muted">
              {footer.location.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </p>
          </div>

          <div className="footer__block fade-up">
            <p className="eyebrow footer__eyebrow">({footer.ai.label})</p>
            <ul className="footer__ai">
              {footer.ai.tools.map((t) => {
                const url = t.url(encoded)
                return (
                  <li key={t.label}>
                    <a className="footer__ai-tile" href={url} onClick={askAI(url, t.label)} aria-label={`Ask ${t.label} about The Third Orbit`} data-label={t.label}>
                      <BrandIcon name={t.icon as IconKey} />
                    </a>
                  </li>
                )
              })}
            </ul>
            <p className={`eyebrow footer__toast${toast ? ' is-on' : ''}`} role="status">
              {toast ?? ' '}
            </p>
          </div>
        </div>

        <div className="footer__col footer__col--social fade-up">
          <p className="eyebrow footer__eyebrow">(Socials)</p>
          <ul className="footer__socials">
            {footer.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="footer__social">
                  <BrandIcon name={s.icon as IconKey} />
                  {s.label}
                  <span className="footer__social-arrow" aria-hidden="true">
                    <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="footer__wordmark" aria-hidden="true">
        <span className="display footer__wordmark-inner">{footer.wordmark}</span>
      </p>

      <div className="footer__bar">
        <p className="footer__clock">
          <span>
            {footer.clock.city} {clock.time}
          </span>
          <span className="footer__muted">
            {clock.date} ({footer.clock.offset})
          </span>
        </p>
        <a
          href="#top"
          className="footer__top"
          onClick={(e) => navigate(window.location.pathname + '#top', e)}
          onMouseEnter={top.enter}
          onMouseLeave={top.leave}
          onFocus={top.enter}
          onBlur={top.leave}
        >
          <span className="footer__top-reel" aria-hidden="true">
            <span className="footer__top-roll" ref={top.roll}>
              <span>Back to top ↑</span>
              <span className="footer__top-twin">Back to top ↑</span>
            </span>
          </span>
          <span className="sr-only">Back to top</span>
        </a>
        <p className="footer__copy">
          <img src="/logos/tto_white_monogram.png" alt="" width={285} height={260} />©{year} The Third Orbit
        </p>
      </div>
    </footer>
  )
}
