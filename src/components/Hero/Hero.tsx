import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../../lib/gsap'
import { resolveNavTheme, registerThemeZone } from '../../lib/theme'
import { getLenis } from '../../lib/smoothScroll'
import { SplitLines } from '../ui/SplitLines'
import { MagneticButton } from '../ui/MagneticButton'
import { OrbitSystem, RINGS, FLATTEN, TILT_DEG } from './OrbitSystem'
import { hero } from '../../content/copy'
import './Hero.css'

/* --------------------------------------------------------------------------
   Orbit maths
   p ∈ [0, 3] is "revolutions completed". The moon rides ring 1, spirals out
   to ring 2 as it completes revolution 1, and to ring 3 after revolution 2.
   -------------------------------------------------------------------------- */
const TILT = (TILT_DEG * Math.PI) / 180
const COS_T = Math.cos(TILT)
const SIN_T = Math.sin(TILT)
const START_ANGLE = Math.PI * 0.7 // front-left of the planet

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x))
const radiusAt = (p: number) =>
  RINGS[0] +
  (RINGS[1] - RINGS[0]) * smooth((p - 0.86) / 0.28) +
  (RINGS[2] - RINGS[1]) * smooth((p - 1.86) / 0.28)

/* Timeline map (abstract units, scrubbed across the pinned scroll distance). */
const T = {
  introOut: 0,
  moonStart: 0.4,
  rev: 3.2, // timeline units per revolution
  chapters: [
    { in: 0.9, out: 3.1 },
    { in: 3.9, out: 6.3 },
    { in: 7.1, out: 9.3 },
  ],
  voidStart: 7.2,
  voidEnd: 9.4,
  themeFlip: 8.3,
  arrival: 9.9,
  end: 12,
}
const MOON_END = T.moonStart + T.rev * 3

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const system = useRef<HTMLDivElement>(null)
  const moon = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(section)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const planetEl = q('.planet')[0] as HTMLElement

      /* ---------- Moon renderer ---------- */
      const setX = gsap.quickSetter(moon.current, 'x', 'px')
      const setY = gsap.quickSetter(moon.current, 'y', 'px')
      const setS = gsap.quickSetter(moon.current, 'scale')
      const counter = q('.hud__count')[0] as HTMLElement
      const bars = q('.hud__bar-fill') as HTMLElement[]
      let R = planetEl.offsetWidth / 2
      let lastFront: boolean | null = null
      let lastCount = ''
      const orbit = { p: 0 }

      const renderMoon = () => {
        const p = orbit.p
        const theta = START_ANGLE - p * Math.PI * 2
        const rx = radiusAt(p)
        const ex = rx * Math.cos(theta)
        const ey = rx * FLATTEN * Math.sin(theta)
        const depth = Math.sin(theta) // +1 nearest the viewer, -1 furthest
        setX((ex * COS_T - ey * SIN_T) * R)
        setY((ex * SIN_T + ey * COS_T) * R)
        setS(0.78 + 0.3 * ((depth + 1) / 2))

        const front = depth > 0
        if (front !== lastFront && moon.current) {
          moon.current.style.zIndex = front ? '4' : '1'
          lastFront = front
        }

        // HUD: which orbit we're on, and progress through each revolution.
        const count = p <= 0.001 ? '00' : `0${Math.min(3, Math.floor(p) + 1)}`
        if (count !== lastCount) {
          counter.textContent = count
          lastCount = count
        }
        bars.forEach((b, i) => gsap.set(b, { scaleX: gsap.utils.clamp(0, 1, p - i) }))
      }

      const measure = () => {
        R = planetEl.offsetWidth / 2
        renderMoon()
      }
      measure()
      window.addEventListener('resize', measure)

      /* ---------- Ambient motion (always on) ---------- */
      if (!reduced) {
        // PRD §4B: background orbit line rotates at 0.5deg/sec.
        gsap.to(q('.halo'), { rotation: 360, duration: 720, ease: 'none', repeat: -1 })
        // Planet surface drifts to suggest axial rotation.
        gsap.to(q('.planet__surface'), { backgroundPositionX: '-200%', duration: 90, ease: 'none', repeat: -1 })
      }

      /* ---------- Mount sequence (Liftoff) ---------- */
      // Hold the scroll until liftoff lands so mount and scroll tweens never collide.
      // Deep links (e.g. /#work from another page) skip the lock and land directly.
      const lenis = window.location.hash && window.location.hash !== '#top' ? null : getLenis()
      lenis?.stop()
      const intro = gsap.timeline({
        defaults: { ease: EASE.reveal },
        delay: 0.25,
        onComplete: () => lenis?.start(),
      })
      intro
        .from(q('.planet'), { scale: 0.86, opacity: 0, duration: 2.2, ease: EASE.move }, 0)
        .from(q('.halo'), { opacity: 0, scale: 0.94, duration: 2.4, ease: EASE.move }, 0)
        .fromTo(
          q('.orbits .ring'),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.4, ease: EASE.inOut, stagger: 0.08 },
          0.3,
        )
        .from(q('.moon__body'), { scale: 0, duration: 1.4, ease: 'back.out(2)' }, 1.4)
        .from(q('.intro .line-inner'), { yPercent: 140, duration: 1.4, stagger: 0.12 }, 0.45)
        .from(q('.intro .fade-up'), { yPercent: 60, autoAlpha: 0, duration: 1.2, stagger: 0.1 }, 1.0)
        .from(q('.hud'), { opacity: 0, y: 12, duration: 1.2 }, 1.5)

      /* ---------- Scroll journey ---------- */
      gsap.set(q('.chapter .line-inner, .arrival .line-inner'), { yPercent: 140 })
      gsap.set(q('.chapter .fade-up, .arrival .fade-up'), { yPercent: 60, autoAlpha: 0 })
      gsap.set(q('.ring'), { opacity: 0.22 })
      gsap.set(q('.ring-label'), { opacity: 0.35 })
      // Labels stay hidden while the intro headline owns the left of the frame.
      gsap.set(q('.ring-labels'), { autoAlpha: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: '+=550%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: measure,
        },
        // Re-resolve on every scrubbed frame; only applies while the hero is under the nav.
        onUpdate: resolveNavTheme,
      })

      // Intro leaves: lines exit upward through their masks.
      tl.to(q('.intro .line-shell'), { yPercent: -140, duration: 0.7, stagger: 0.08, ease: EASE.inOut }, T.introOut)
        .to(q('.intro .fade-up'), { autoAlpha: 0, yPercent: -40, duration: 0.5, stagger: 0.05, ease: EASE.inOut }, T.introOut)
        .to(q('.hud__cue'), { opacity: 0, duration: 0.4 }, T.introOut)
        .to(q('.ring-labels'), { autoAlpha: 1, duration: 0.5 }, T.introOut + 0.6)

      // The moon: three revolutions, ring by ring.
      tl.to(orbit, { p: 3, duration: MOON_END - T.moonStart, onUpdate: renderMoon }, T.moonStart)

      // Ring + label emphasis follows the moon.
      ;[1, 2, 3].forEach((n) => {
        const at = T.moonStart + T.rev * (n - 1) - 0.1
        tl.to(q(`.ring-${n}`), { opacity: 1, duration: 0.5, ease: EASE.move }, at)
          .to(q(`.ring-label-${n}`), { opacity: 1, duration: 0.5 }, at)
        if (n > 1) {
          tl.to(q(`.ring-${n - 1}`), { opacity: 0.22, duration: 0.5 }, at)
            .to(q(`.ring-label-${n - 1}`), { opacity: 0.35, duration: 0.5 }, at)
        }
      })

      // Chapters: one story beat per revolution.
      T.chapters.forEach((c, i) => {
        const el = `.chapter-${i + 1}`
        tl.to(q(`${el} .line-inner`), { yPercent: 0, duration: 0.8, stagger: 0.1, ease: EASE.reveal }, c.in)
          .to(q(`${el} .fade-up`), { yPercent: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: EASE.move }, c.in + 0.25)
          .to(q(`${el} .line-shell`), { yPercent: -140, duration: 0.6, stagger: 0.08, ease: EASE.inOut }, c.out)
          .to(q(`${el} .fade-up`), { autoAlpha: 0, yPercent: -40, duration: 0.45, ease: EASE.inOut }, c.out)
      })

      // Third orbit: daylight gives way to the vacuum of space.
      tl.fromTo(
        stage.current,
        { '--hero-bg': '#D7D8D4', '--hero-ink': '#111111', '--halo': 'rgba(17,17,17,0.13)' },
        { '--hero-bg': '#0A0A0A', '--hero-ink': '#FAFAFA', '--halo': 'rgba(250,250,250,0.08)', duration: T.voidEnd - T.voidStart, ease: EASE.inOut },
        T.voidStart,
      )
        .to(q('.void'), { opacity: 1, duration: T.voidEnd - T.voidStart, ease: EASE.inOut }, T.voidStart)
        .to(q('.sunlight'), { opacity: 0, duration: T.voidEnd - T.voidStart, ease: EASE.inOut }, T.voidStart)
        .to(q('.planet__atmo'), { opacity: 1, duration: T.voidEnd - T.voidStart, ease: EASE.inOut }, T.voidStart)
        .to(q('.moon__body'), { '--moon-glow': 1, duration: T.voidEnd - T.voidStart, ease: EASE.inOut }, T.voidStart)

      // Arrival.
      tl.to(q('.arrival .line-inner'), { yPercent: 0, duration: 1, stagger: 0.12, ease: EASE.reveal }, T.arrival)
        .to(q('.arrival .fade-up'), { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: EASE.move }, T.arrival + 0.4)
        .to(q('.ring-labels'), { autoAlpha: 0, duration: 0.5 }, T.arrival - 0.3)
        .to(q('.ring-1, .ring-2'), { opacity: 0.1, duration: 0.6 }, T.arrival - 0.3)
        .to(q('.hud'), { opacity: 0, duration: 0.6 }, T.arrival)
        .set({}, {}, T.end)

      // The hero's surface flips mid-timeline, so its zone reports the live theme.
      const unzone = registerThemeZone(section.current!, () => (tl.time() > T.themeFlip ? 'dark' : 'light'))

      return () => {
        window.removeEventListener('resize', measure)
        lenis?.start()
        unzone()
      }
    },
    { scope: section },
  )

  return (
    <section className="hero" id="top" ref={section}>
      <div className="hero__stage" ref={stage}>
        <div className="sunlight" aria-hidden="true" />
        <div className="void" aria-hidden="true" />

        <OrbitSystem ref={system} moonRef={moon} />

        <div className="hero__type">
          <div className="intro">
            <div className="intro__top">
              <p className="eyebrow fade-up intro__eyebrow">{hero.intro.eyebrow}</p>
              <p className="intro__sub fade-up">{hero.intro.sub}</p>
              <div className="fade-up intro__cta">
                <MagneticButton href="#connect" label={hero.intro.cta} />
              </div>
            </div>
            <SplitLines as="h1" lines={hero.intro.headline} className="display intro__title" />
          </div>

          {hero.orbits.map((o, i) => (
            <div className={`chapter chapter-${i + 1}`} key={o.index}>
              <p className="eyebrow fade-up chapter__label">
                <span className="chapter__index">Orbit {o.index}</span>
                <span className="chapter__rule" />
                <span>{o.name}</span>
              </p>
              <SplitLines lines={o.headline} className="display chapter__title" />
              <p className="chapter__body fade-up">{o.body}</p>
            </div>
          ))}

          <div className="arrival">
            <p className="eyebrow fade-up arrival__eyebrow">
              <img src="/logos/tto_white_monogram.png" alt="" width={285} height={260} />
              {hero.arrival.eyebrow}
            </p>
            <SplitLines lines={hero.arrival.headline} className="display arrival__title" />
            <p className="arrival__sub fade-up">{hero.arrival.sub}</p>
            <div className="fade-up arrival__cta">
              <MagneticButton href="#connect" label={hero.arrival.cta} size="lg" />
            </div>
          </div>
        </div>

        <div className="hud" aria-hidden="true">
          <div className="hud__orbit">
            <span className="eyebrow">Orbit</span>
            <span className="hud__count">00</span>
            <span className="hud__total">/ 03</span>
          </div>
          <div className="hud__bars">
            {[0, 1, 2].map((i) => (
              <span className="hud__bar" key={i}>
                <span className="hud__bar-fill" />
              </span>
            ))}
          </div>
          <div className="hud__cue eyebrow">
            {hero.intro.cue}
            <span className="hud__cue-line" />
          </div>
        </div>
      </div>
    </section>
  )
}
