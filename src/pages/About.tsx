import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../lib/gsap'
import { useSectionTheme } from '../hooks/useSectionTheme'
import { surfaceCrossfade } from '../lib/surface'
import { Nav } from '../components/Nav/Nav'
import { SiteFooter } from '../components/SiteFooter'
import { SplitLines } from '../components/ui/SplitLines'
import { OrbitDiagram, placeMoon, type OrbitGeometry } from '../components/ui/OrbitDiagram'
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

/** Hero system: the moon circles orbit 03 forever. */
const HERO: OrbitGeometry = { w: 440, h: 280, rings: [74, 116, 160], flatten: 0.34, tilt: -14, planet: 46, moon: 7 }

function AboutHero() {
  const root = useRef<HTMLElement>(null)
  const sys = useRef<SVGSVGElement>(null)
  useSectionTheme(root, 'dark')
  useReveal(root, 'top 90%')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Rings draw in, far and near halves together, then drop the dash so no seam remains.
      gsap.fromTo(
        q('.orbd__ring'),
        { strokeDasharray: '1 1', strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          stagger: { each: 0.12, from: 'start' },
          ease: EASE.inOut,
          delay: 0.3,
          onComplete: () => { gsap.set(q('.orbd__ring'), { clearProps: 'strokeDasharray,strokeDashoffset' }) },
        },
      )
      gsap.from(q('.orbd__planet'), { scale: 0.85, opacity: 0, transformOrigin: '50% 50%', duration: 1.6, ease: EASE.move, delay: 0.2 })
      gsap.fromTo(q('.ab-sys'), { yPercent: 0 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      if (reduced || !sys.current) return
      const a = { t: Math.PI * 0.32 }
      gsap.to(a, {
        t: Math.PI * 0.32 + Math.PI * 2,
        duration: 24,
        ease: 'none',
        repeat: -1,
        onUpdate: () => placeMoon(sys.current!, HERO, HERO.rings[2], a.t),
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

      <div className="ab-sys fade-up">
        <OrbitDiagram ref={sys} g={HERO} active={2} labels />
      </div>
    </section>
  )
}

/** Card icon: the same system, small planet, one orbit highlighted per card. */
const CARD: OrbitGeometry = { w: 240, h: 96, rings: [38, 66, 96], flatten: 0.28, tilt: -10, planet: 8, moon: 4.2 }

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
            <div className="ab-orbit__mark">
              <OrbitDiagram g={CARD} active={i} moonAngle={Math.PI * 0.3} />
            </div>
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
