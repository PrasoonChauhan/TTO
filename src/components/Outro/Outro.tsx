import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { surfaceCrossfade } from '../../lib/surface'
import { MagneticButton } from '../ui/MagneticButton'
import { outro, footer } from '../../content/copy'
import './Outro.css'

/* Deterministic star field so it never reshuffles between renders. */
function stars(seed: number, count: number) {
  let s = seed
  const r = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  return Array.from({ length: count }, () => ({ x: r() * 100, y: r() * 100, r: 0.4 + r() * r() * 1.4, o: 0.25 + r() * 0.75 }))
}
const FAR = stars(11, 160)
const NEAR = stars(29, 40)

/** Stars as box-shadows of one 1px dot: round at any size, one paint layer. */
const starShadow = (list: typeof FAR) =>
  list.map((s) => `${s.x.toFixed(2)}vw ${(s.y * 1.2).toFixed(2)}vh 0 ${(s.r * 0.6).toFixed(2)}px rgba(255,255,255,${s.o.toFixed(2)})`).join(',')

/** Per-line drift in vw: [start, end]. Always left to right, never to the edge. */
const DRIFT: [number, number][] = [
  [-3, 4],
  [-6, 2],
  [-2, 7],
  [-5, 3],
]

function TextArrow() {
  return (
    <svg className="outro__arrow" viewBox="0 0 100 72" aria-hidden="true">
      <path d="M4 36 H88 M58 6 L90 36 L58 66" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="square" />
    </svg>
  )
}

/**
 * Final approach. A statement before the footer: the planet from the hero,
 * seen up close, rising under a drifting line of type.
 */
export function Outro() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'dark')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      surfaceCrossfade(root.current!, 'dark')
      // Space only appears once the surface has gone dark.
      gsap.fromTo(q('.outro__space'), { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 45%', end: 'top 5%', scrub: true } })

      /* ---------- Entrance ---------- */
      gsap.set(q('.outro__line-inner'), { yPercent: 110 })
      gsap.set(q('.outro .fade-up'), { autoAlpha: 0, y: 16 })
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 45%', toggleActions: 'play none none none' } })
        .to(q('.outro__line-inner'), { yPercent: 0, duration: 1.3, stagger: 0.1, ease: EASE.reveal }, 0)
        .to(q('.outro .fade-up'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: EASE.move }, 0.5)

      /* ---------- Drift + parallax, bound to the whole section ---------- */
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const scale = window.matchMedia('(max-width: 900px)').matches ? 0.5 : 1
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
      })
      ;(q('.outro__line') as HTMLElement[]).forEach((line, i) => {
        const [a, b] = DRIFT[i % DRIFT.length]
        tl.fromTo(line, { x: () => `${a * scale}vw` }, { x: () => `${b * scale}vw` }, 0)
      })
      if (!reduced) {
        tl.fromTo(q('.outro__planet'), { yPercent: 5 }, { yPercent: 0 }, 0)
          .fromTo(q('.outro__bloom'), { opacity: 0.35, yPercent: 30 }, { opacity: 1, yPercent: 0 }, 0)
          .fromTo(q('.outro__stars--far'), { yPercent: 0 }, { yPercent: -6 }, 0)
          .fromTo(q('.outro__stars--near'), { yPercent: 0 }, { yPercent: -14 }, 0)
          .fromTo(q('.outro__moon'), { x: '-30vw', y: '6vh' }, { x: '24vw', y: '-4vh' }, 0)
      }
    },
    { scope: root },
  )

  return (
    <section className="outro" id="connect" ref={root} aria-labelledby="outro-title">
      <div className="outro__stage">
        {/* ---------- Space ---------- */}
        <div className="outro__space" aria-hidden="true">
          <span className="outro__stars outro__stars--far" style={{ boxShadow: starShadow(FAR) }} />
          <span className="outro__stars outro__stars--near" style={{ boxShadow: starShadow(NEAR) }} />
          <span className="outro__moon" />
          <div className="outro__bloom" />
          <div className="outro__planet">
            <div className="outro__surface" />
          </div>
        </div>

        {/* ---------- HUD ---------- */}
        <div className="outro__hud fade-up" aria-hidden="true">
          <span className="eyebrow">
            <span className="outro__muted">{outro.index}</span> {outro.label}
          </span>
          <span className="eyebrow outro__status">
            <span className="outro__pulse" />
            {outro.status}
          </span>
        </div>

        {/* ---------- Statement ---------- */}
        <div className="outro__content">
          <h2 className="outro__title" id="outro-title" aria-label={outro.lines.map((l) => l.text).join(' ')}>
            {outro.lines.map((l, i) => (
              <span className={`outro__line outro__line--${i + 1}`} key={i} aria-hidden="true">
                <span className="outro__line-mask">
                  <span className="outro__line-inner">
                    {l.arrow && <TextArrow />}
                    {l.text}
                  </span>
                </span>
              </span>
            ))}
          </h2>

          <div className="outro__cta">
            <div className="fade-up">
              <MagneticButton href={`mailto:${footer.email}?subject=${encodeURIComponent('Our story')}`} label={outro.cta} size="lg" />
            </div>
            <p className="eyebrow outro__note fade-up">{outro.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
