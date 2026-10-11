import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { surfaceCrossfade } from '../../lib/surface'
import { SplitLines } from '../ui/SplitLines'
import { MagneticButton } from '../ui/MagneticButton'
import { processCopy as process } from '../../content/copy'
import './Process.css'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * How we work. A light, unpinned five-stage timeline. The line fills with
 * scroll and each stage arrives as the line reaches it.
 */
export function Process() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'light')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const stages = q('.pstage') as HTMLElement[]
      const n = stages.length

      /* ---------- Back to daylight, whole screen ---------- */
      surfaceCrossfade(root.current!, 'light')

      /* ---------- Header ---------- */
      gsap.set(q('.process__head .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.process__title .line-inner'), { yPercent: 140 })
      gsap
        .timeline({ scrollTrigger: { trigger: q('.process__head')[0], start: 'top 75%', toggleActions: 'play none none none' } })
        .to(q('.process__title .line-inner'), { yPercent: 0, duration: 1.2, stagger: 0.1, ease: EASE.reveal }, 0)
        .to(q('.process__head .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE.move }, 0.2)

      /* ---------- Timeline: line fills with scroll, stages arrive as it reaches them ---------- */
      gsap.set(q('.pstage__content'), { autoAlpha: 0, y: 24 })
      const shown = new Set<number>()
      const light = (lit: number) => {
        stages.forEach((s, i) => {
          s.classList.toggle('is-lit', i < lit)
          if (i < lit && !shown.has(i)) {
            shown.add(i)
            gsap.to(s.querySelector('.pstage__content'), { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE.reveal })
          }
        })
      }
      const vertical = window.matchMedia('(max-width: 900px)').matches
      gsap.fromTo(
        q('.process__fill'),
        vertical ? { scaleY: 0 } : { scaleX: 0 },
        {
          ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
          ease: 'none',
          scrollTrigger: {
            trigger: q('.process__track')[0],
            start: vertical ? 'top 70%' : 'top 82%',
            end: vertical ? 'bottom 70%' : 'top 30%',
            scrub: 0.6,
            // A stage lights as soon as the fill reaches its node.
            onUpdate: (self) => light(Math.min(n, Math.floor(self.progress * n + (vertical ? 0.6 : 0.999)))),
          },
        },
      )

      /* ---------- Hover: focus one stage, dim the rest ---------- */
      if (window.matchMedia('(hover: none)').matches) return
      const track = q('.process__track')[0] as HTMLElement
      const quick = { duration: 0.4, ease: EASE.move, overwrite: 'auto' as const }
      const onEnter = (e: Event) =>
        stages.forEach((s) => gsap.to(s.querySelector('.pstage__body-wrap'), { opacity: s === e.currentTarget ? 1 : 0.35, ...quick }))
      const onLeave = () => gsap.to(q('.pstage__body-wrap'), { opacity: 1, ...quick })
      stages.forEach((s) => s.addEventListener('mouseenter', onEnter))
      track.addEventListener('mouseleave', onLeave)
      return () => {
        stages.forEach((s) => s.removeEventListener('mouseenter', onEnter))
        track.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: root },
  )

  return (
    <section className="process" id="process" ref={root} data-nav-glass aria-labelledby="process-title">
      <header className="process__head">
        <div className="process__intro">
          <p className="process__label fade-up" id="process-title">
            <span className="eyebrow process__index">{process.index}</span>
            <span className="process__dot" aria-hidden="true" />
            {process.label}
          </p>
          <SplitLines as="h2" lines={process.title} className="display process__title" />
        </div>
        <div className="process__aside">
          <p className="process__sub fade-up">{process.sub}</p>
          <div className="fade-up">
            <MagneticButton href="#connect" label={process.cta} />
          </div>
        </div>
      </header>

      <ol className="process__track">
        <span className="process__rail" aria-hidden="true">
          <span className="process__fill" />
        </span>
        {process.stages.map((s, i) => (
          <li className="pstage" key={s.name}>
            <span className="pstage__node" aria-hidden="true" />
            <div className="pstage__content">
              <p className="eyebrow pstage__num">
                {pad(i + 1)} <span className="pstage__meta">· {s.meta}</span>
              </p>
              <h3 className="display pstage__name">{s.name}</h3>
              <div className="pstage__body-wrap">
                <p className="pstage__line">{s.line}</p>
                <p className="pstage__body">{s.body}</p>
                {s.loop && (
                  <p className="eyebrow pstage__loop">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <path d="M12.5 5.5A5 5 0 1 0 13 9" />
                      <path d="M13 2.5v3.2H9.8" />
                    </svg>
                    {s.loop}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
