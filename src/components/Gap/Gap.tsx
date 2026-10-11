import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { gap } from '../../content/copy'
import './Gap.css'

/* Diagram geometry (SVG units). Planet sits in the lower-left corner. */
const C = { x: 40, y: 280 }
const R = { planet: 46, o1: 92, o2: 160, o3: 240 }
const GAP_ANGLE = -45 // degrees, where the dimension line is drawn
const MOON_FROM = -82
const MOON_TO = -18

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return { x: C.x + r * Math.cos(a), y: C.y + r * Math.sin(a) }
}
/** Quarter arc from straight up to straight right. */
const arc = (r: number) => `M ${C.x} ${C.y - r} A ${r} ${r} 0 0 1 ${C.x + r} ${C.y}`

function GapDiagram() {
  const a = polar(R.o2, GAP_ANGLE)
  const b = polar(R.o3, GAP_ANGLE)
  const ghost = polar(R.o3, GAP_ANGLE)
  const tick = (p: { x: number; y: number }) => {
    // Short tick perpendicular to the dimension line.
    const d = 6 * Math.SQRT1_2
    return `M ${p.x - d} ${p.y - d} L ${p.x + d} ${p.y + d}`
  }
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }

  return (
    <svg className="gapd" viewBox="0 0 320 320" aria-hidden="true">
      <defs>
        <radialGradient id="gapd-planet" cx="34%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#6e6e6e" />
          <stop offset="35%" stopColor="#2a2a2a" />
          <stop offset="75%" stopColor="#111" />
          <stop offset="100%" stopColor="#060606" />
        </radialGradient>
      </defs>

      <path className="gapd__orbit gapd__orbit--1" d={arc(R.o1)} pathLength={1} />
      <path className="gapd__orbit gapd__orbit--2" d={arc(R.o2)} pathLength={1} />
      <path className="gapd__orbit gapd__orbit--3" d={arc(R.o3)} pathLength={1} />

      <text className="gapd__label" x={C.x + R.o1} y={C.y + 16} textAnchor="middle">01</text>
      <text className="gapd__label gapd__label--on" x={C.x + R.o2} y={C.y + 16} textAnchor="middle">02</text>
      <text className="gapd__label" x={C.x + R.o3} y={C.y + 16} textAnchor="middle">03</text>

      <circle className="gapd__planet" cx={C.x} cy={C.y} r={R.planet} fill="url(#gapd-planet)" />

      {/* The gap: a dimension line between where you are and where you need to be. */}
      <g className="gapd__dim">
        <path className="gapd__dim-line" d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} pathLength={1} />
        <path className="gapd__dim-tick" d={tick(a)} />
        <path className="gapd__dim-tick" d={tick(b)} />
        <text className="gapd__dim-text" x={mid.x + 12} y={mid.y + 12}>THE GAP</text>
      </g>

      <circle className="gapd__ghost" cx={ghost.x} cy={ghost.y} r={7} />
      <circle className="gapd__moon" cx={polar(R.o2, MOON_FROM).x} cy={polar(R.o2, MOON_FROM).y} r={7} />
    </svg>
  )
}

/**
 * The gap. Names the problem that keeps founders in orbit two.
 * Words light up with scroll; the left panel reads out each beat.
 */
export function Gap() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'dark')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const words = q('.gap__word') as HTMLElement[]
      const wordPara = words.map((w) => Number(w.dataset.p))
      const rows = q('.gap__row') as HTMLElement[]
      const counter = q('.gap__count')[0] as HTMLElement
      const moon = q('.gapd__moon')[0]
      const fill = q('.gap__progress-fill')[0]
      const beats = gap.paragraphs.length

      /* ---------- Panel entrance ---------- */
      gsap.set(q('.gap .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.gapd__orbit'), { strokeDasharray: '1 1', strokeDashoffset: 1 })
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', toggleActions: 'play none none none' } })
        .to(q('.gap .fade-up'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: EASE.move }, 0)
        .to(q('.gapd__orbit'), { strokeDashoffset: 0, duration: 1.6, stagger: 0.15, ease: EASE.inOut }, 0.2)

      /* ---------- Beats: each paragraph lights its readouts ---------- */
      gsap.set(q('.gapd__dim-line'), { strokeDasharray: '1 1', strokeDashoffset: 1 })
      gsap.set(q('.gapd__dim-tick, .gapd__dim-text, .gapd__ghost'), { opacity: 0 })
      let current = -1
      const setBeat = (i: number) => {
        if (i === current) return
        current = i
        counter.textContent = `0${i + 1}/0${beats}`
        rows.forEach((r) =>
          gsap.to(r, { opacity: Number(r.dataset.p) === i ? 1 : 0.3, duration: 0.5, ease: EASE.move, overwrite: 'auto' }),
        )
        const last = i === beats - 1
        gsap.to(q('.gapd__dim-line'), { strokeDashoffset: last ? 0 : 1, duration: 0.8, ease: EASE.inOut, overwrite: 'auto' })
        gsap.to(q('.gapd__dim-tick, .gapd__dim-text'), { opacity: last ? 1 : 0, duration: 0.5, delay: last ? 0.4 : 0, overwrite: 'auto' })
        gsap.to(q('.gapd__ghost'), { opacity: last ? 1 : 0, duration: 0.6, delay: last ? 0.6 : 0, overwrite: 'auto' })
      }
      setBeat(0)

      /* ---------- Reading timeline ----------
         Words brighten one after another (each fades over WORD units, starting
         1 unit apart). The word at the bright front decides the beat; overall
         progress drives the moon, which drifts along orbit two but never escapes. */
      const WORD = 4
      const reading = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
      reading.fromTo(words, { opacity: 0.16 }, { opacity: 1, duration: WORD, stagger: 1 }, 0)
      reading.to({}, { duration: words.length * 0.15 }) // brief hold once fully lit
      const readEnd = WORD + words.length - 1

      reading.eventCallback('onUpdate', () => {
        const t = reading.time()
        const front = gsap.utils.clamp(0, words.length - 1, Math.floor(t - WORD / 2))
        setBeat(wordPara[front])
        const p = gsap.utils.clamp(0, 1, t / readEnd)
        const pos = polar(R.o2, MOON_FROM + (MOON_TO - MOON_FROM) * p)
        gsap.set(moon, { attr: { cx: pos.x, cy: pos.y } })
        gsap.set(fill, { scaleX: p })
      })

      const mm = gsap.matchMedia()
      // Desktop: hold the section in place while it is read.
      mm.add('(min-width: 901px)', () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.6,
          animation: reading,
        })
      })
      // Small screens: the stacked layout is taller than the viewport, so read in flow.
      mm.add('(max-width: 900px)', () => {
        ScrollTrigger.create({
          trigger: q('.gap__text')[0],
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: 0.6,
          animation: reading,
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="gap" id="gap" ref={root} data-nav-glass aria-labelledby="gap-title">
      <div className="gap__inner">
        <aside className="gap__aside">
          <div className="gap__panel">
            <div className="gap__progress fade-up">
              <span className="gap__progress-track">
                <span className="gap__progress-fill" />
              </span>
              <span className="eyebrow gap__count">01/0{gap.paragraphs.length}</span>
            </div>

            <p className="gap__label fade-up" id="gap-title">
              <span className="eyebrow gap__index">{gap.index}</span>
              <span className="gap__dot" aria-hidden="true" />
              {gap.label}
            </p>

            <div className="gap__diagram fade-up">
              <GapDiagram />
            </div>

            <dl className="gap__readouts fade-up">
              {gap.readouts.map((r) => (
                <div className="gap__row" data-p={r.p} key={r.key}>
                  <dt className="eyebrow">{r.key}</dt>
                  <span className="gap__leader" aria-hidden="true" />
                  <dd className="eyebrow">{r.value}</dd>
                </div>
              ))}
            </dl>

            <p className="eyebrow gap__note fade-up">{gap.note}</p>
          </div>
        </aside>

        <div className="gap__text">
          {gap.paragraphs.map((p, i) => (
            <p className="display gap__para" key={i}>
              {p.split(' ').map((w, j) => (
                <span className="gap__word" data-p={i} key={j}>
                  {w}{' '}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
