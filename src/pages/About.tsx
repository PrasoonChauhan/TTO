import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../lib/gsap'
import { useSectionTheme } from '../hooks/useSectionTheme'
import { surfaceCrossfade } from '../lib/surface'
import { Nav } from '../components/Nav/Nav'
import { SiteFooter } from '../components/SiteFooter'
import { SplitLines } from '../components/ui/SplitLines'
import { about } from '../content/copy'
import './About.css'

/* ---------- Shared bits ---------- */

function Label({ index, children, light }: { index: string; children: string; light?: boolean }) {
  return (
    <p className="ab-label fade-up">
      <span className="eyebrow ab-label__index">{index}</span>
      <span className={`ab-label__dot${light ? ' ab-label__dot--light' : ''}`} aria-hidden="true" />
      {children}
    </p>
  )
}

/** Fade-up + line reveals for any block, once, as it enters. */
function useReveal(ref: React.RefObject<HTMLElement | null>, start = 'top 75%') {
  useGSAP(
    () => {
      const q = gsap.utils.selector(ref)
      gsap.set(q('.fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.line-inner'), { yPercent: 140 })
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start, toggleActions: 'play none none none' } })
        .to(q('.line-inner'), { yPercent: 0, duration: 1.2, stagger: 0.08, ease: EASE.reveal }, 0)
        .to(q('.fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06, ease: EASE.move }, 0.2)
    },
    { scope: ref },
  )
}

/* ---------- 1. Hero: the system, seen from orbit three ---------- */

const RINGS = [70, 112, 156]

function AboutHero() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'dark')
  useReveal(root, 'top 90%')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const moon = q('.ab-sys__moon')[0]
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.fromTo(q('.ab-sys__ring'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, stagger: 0.15, ease: EASE.inOut, delay: 0.3 })
      if (reduced) return
      // The moon keeps circling the third orbit.
      const a = { t: 0.15 }
      gsap.to(a, {
        t: 1.15,
        duration: 22,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          const ang = a.t * Math.PI * 2
          gsap.set(moon, { attr: { cx: 200 + Math.cos(ang) * RINGS[2], cy: 200 + Math.sin(ang) * RINGS[2] * 0.36 } })
        },
      })
      gsap.fromTo(q('.ab-sys__tilt'), { rotation: -14, svgOrigin: '200 200' }, {
        rotation: -24,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section className="ab-hero" id="top" ref={root} data-nav-glass>
      <div className="ab-hero__text">
        <p className="eyebrow ab-hero__eyebrow fade-up">{about.hero.eyebrow}</p>
        <SplitLines as="h1" lines={about.hero.title} className="display ab-hero__title" />
        <p className="ab-hero__sub fade-up">{about.hero.sub}</p>
        <p className="eyebrow ab-hero__meta fade-up">
          {about.hero.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </p>
      </div>

      <svg className="ab-sys fade-up" viewBox="0 0 400 400" aria-hidden="true">
        <g className="ab-sys__tilt" transform="rotate(-14 200 200)">
          {RINGS.map((r, i) => (
            <ellipse
              key={r}
              className={`ab-sys__ring${i === 2 ? ' ab-sys__ring--on' : ''}`}
              cx={200}
              cy={200}
              rx={r}
              ry={r * 0.36}
              pathLength={1}
            />
          ))}
          <circle className="ab-sys__planet" cx={200} cy={200} r={44} />
          <circle className="ab-sys__moon" cx={200 + RINGS[2]} cy={200} r={7} />
          {RINGS.map((r, i) => (
            <text key={r} className="ab-sys__label" x={200 - r - 8} y={204} textAnchor="end">
              0{i + 1}
            </text>
          ))}
        </g>
        <defs>
          <radialGradient id="ab-planet" cx="34%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#6e6e6e" />
            <stop offset="35%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#060606" />
          </radialGradient>
        </defs>
      </svg>
    </section>
  )
}

/* ---------- 2. The name ---------- */

function TheName() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'light')
  useGSAP(() => { surfaceCrossfade(root.current!, 'light') }, { scope: root })
  useReveal(root)
  const n = about.name
  return (
    <section className="ab-name" ref={root} data-nav-glass>
      <Label index={n.index}>{n.label}</Label>
      <SplitLines as="h2" lines={n.title} className="display ab-name__title" />
      <ol className="ab-name__orbits">
        {n.orbits.map((o, i) => (
          <li className={`ab-orbit fade-up${o.ours ? ' ab-orbit--ours' : ''}`} key={o.n}>
            <svg className="ab-orbit__mark" viewBox="0 0 120 40" aria-hidden="true">
              {[0, 1, 2].map((k) => (
                <ellipse key={k} cx={20} cy={20} rx={12 + k * 14} ry={(12 + k * 14) * 0.4} className={k === i ? 'is-on' : ''} />
              ))}
              <circle cx={20} cy={20} r={5} className="ab-orbit__planet" />
              <circle cx={20 + 12 + i * 14} cy={20} r={3.2} className="ab-orbit__moon" />
            </svg>
            <p className="eyebrow ab-orbit__n">Orbit {o.n}</p>
            <h3 className="display ab-orbit__name">{o.name}</h3>
            <p className="ab-orbit__body">{o.body}</p>
            {o.ours && <p className="eyebrow ab-orbit__ours">{o.ours}</p>}
          </li>
        ))}
      </ol>
      <p className="ab-name__note fade-up">{n.note}</p>
    </section>
  )
}

/* ---------- 3. Beliefs ---------- */

function Beliefs() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'light')
  useReveal(root)
  useGSAP(
    () => {
      if (window.matchMedia('(hover: none)').matches) return
      const q = gsap.utils.selector(root)
      const rows = q('.ab-belief') as HTMLElement[]
      const list = q('.ab-beliefs__list')[0] as HTMLElement
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
  const b = about.beliefs
  return (
    <section className="ab-beliefs" ref={root} data-nav-glass>
      <div className="ab-beliefs__head">
        <Label index={b.index}>{b.label}</Label>
        <SplitLines as="h2" lines={b.title} className="display ab-beliefs__title" />
      </div>
      <ol className="ab-beliefs__list">
        {b.items.map((it, i) => (
          <li className="ab-belief fade-up" key={it.t}>
            <span className="eyebrow ab-belief__n">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="display ab-belief__t">{it.t}</h3>
            <p className="ab-belief__b">{it.b}</p>
          </li>
        ))}
      </ol>
      {/* Facts close this section so the dark crossfade that follows fades a full-height block. */}
      <Facts />
    </section>
  )
}

/* ---------- 4. At a glance ---------- */

function Facts() {
  const root = useRef<HTMLDivElement>(null)
  useReveal(root, 'top 85%')
  const f = about.facts
  return (
    <div className="ab-facts" ref={root}>
      <Label index={f.index}>{f.label}</Label>
      <dl className="ab-facts__grid">
        {f.items.map((it) => (
          <div className="ab-fact fade-up" key={it.v}>
            <dt className="display ab-fact__v">{it.v}</dt>
            <dd className="ab-fact__l">{it.l}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function About() {
  return (
    <>
      <Nav />
      <div className="grain" aria-hidden="true" />
      <main>
        <AboutHero />
        <TheName />
        <Beliefs />
      </main>
      <SiteFooter />
    </>
  )
}
