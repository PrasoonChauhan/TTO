import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { surfaceCrossfade } from '../../lib/surface'
import { SplitLines } from '../ui/SplitLines'
import { leadFormLink } from '../../lib/leadForm'
import { MagneticButton } from '../ui/MagneticButton'
import { close } from '../../content/copy'
import './Close.css'

/**
 * We close that gap. The answer to section 03, so it moves from void to
 * daylight. The headline literally closes its own gap as you scroll.
 */
export function Close() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'light')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const touch = window.matchMedia('(hover: none)').matches

      /* ---------- Void to daylight, bound to scroll ---------- */
      surfaceCrossfade(root.current!, 'light')

      /* ---------- Header + headline reveal ---------- */
      gsap.set(q('.close__head .fade-up, .close__intro .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.close__title .line-inner'), { yPercent: 140 })
      gsap
        .timeline({ scrollTrigger: { trigger: q('.close__title')[0], start: 'top 85%', toggleActions: 'play none none none' } })
        .to(q('.close__head .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE.move }, 0)
        .to(q('.close__title .line-inner'), { yPercent: 0, duration: 1.3, stagger: 0.12, ease: EASE.reveal }, 0.1)
        .to(q('.close__intro .fade-up'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: EASE.move }, 0.6)

      /* ---------- The headline closes its own gap (scrubbed) ---------- */
      const title = q('.close__title')[0] as HTMLElement
      const a = q('.close__a')[0] as HTMLElement
      const b = q('.close__b')[0] as HTMLElement
      const span = q('.close__span')[0] as HTMLElement
      const readout = q('.close__readout')[0] as HTMLElement
      const wordGap = () => parseFloat(getComputedStyle(title).fontSize) * 0.26
      const openGap = () => Math.max(wordGap(), title.clientWidth - a.offsetWidth - b.offsetWidth)

      gsap.fromTo(
        span,
        { width: openGap },
        {
          width: wordGap,
          ease: 'none',
          immediateRender: true,
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const left = Math.round(100 * (1 - self.progress))
              readout.textContent = `Gap ${String(left).padStart(2, '0')}%`
            },
          },
        },
      )
      // The measuring line fades out as the halves meet.
      gsap.to(q('.close__measure'), {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: title, start: 'top 42%', end: 'top 30%', scrub: true },
      })

      /* ---------- Ledger rows ---------- */
      const rows = q('.crow') as HTMLElement[]
      rows.forEach((row) => {
        const r = gsap.utils.selector(row)
        gsap.set(r('.crow__rule'), { scaleX: 0 })
        gsap.set(r('.crow__strike'), { scaleX: 0 })
        gsap.set(r('.crow__index, .crow__key, .crow__gap, .crow__body, .crow__tag'), { autoAlpha: 0, y: 14 })
        gsap.set(r('.crow__arrow-line'), { strokeDashoffset: 1 })
        gsap.set(r('.crow__arrow-head'), { opacity: 0 })
        gsap.set(r('.crow__title .line-inner'), { yPercent: 140 })

        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 82%', toggleActions: 'play none none none' } })
          .to(r('.crow__rule'), { scaleX: 1, duration: 1, ease: EASE.inOut }, 0)
          .to(r('.crow__index, .crow__key, .crow__gap'), { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: EASE.move }, 0.15)
          // Strike the gap, then mute it.
          .to(r('.crow__strike'), { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, 0.6)
          .to(r('.crow__gap'), { opacity: 0.45, duration: 0.4 }, 0.9)
          .to(r('.crow__arrow-line'), { strokeDashoffset: 0, duration: 0.55, ease: 'power3.inOut' }, 0.85)
          .to(r('.crow__arrow-head'), { opacity: 1, duration: 0.25 }, 1.25)
          .to(r('.crow__title .line-inner'), { yPercent: 0, duration: 1.1, stagger: 0.08, ease: EASE.reveal }, 1.05)
          .to(r('.crow__body, .crow__tag'), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: EASE.move }, 1.3)
      })

      /* ---------- CTA ---------- */
      gsap.set(q('.close__cta-rule'), { scaleX: 0 })
      gsap.set(q('.close__prompt .line-inner'), { yPercent: 140 })
      gsap.set(q('.close__cta .fade-up'), { autoAlpha: 0, y: 16 })
      gsap
        .timeline({ scrollTrigger: { trigger: q('.close__cta')[0], start: 'top 80%', toggleActions: 'play none none none' } })
        .to(q('.close__cta-rule'), { scaleX: 1, duration: 1.2, ease: EASE.inOut }, 0)
        .to(q('.close__prompt .line-inner'), { yPercent: 0, duration: 1.2, stagger: 0.1, ease: EASE.reveal }, 0.2)
        .to(q('.close__cta .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: EASE.move }, 0.6)

      /* ---------- Hover: focus one row, dim the rest ---------- */
      if (touch) return
      const ledger = q('.close__ledger')[0] as HTMLElement
      const quick = { duration: 0.4, ease: EASE.move, overwrite: 'auto' as const }
      const onEnter = (e: Event) =>
        rows.forEach((row) => gsap.to(row.querySelector('.crow__content'), { opacity: row === e.currentTarget ? 1 : 0.35, ...quick }))
      const onLeave = () => rows.forEach((row) => gsap.to(row.querySelector('.crow__content'), { opacity: 1, ...quick }))
      rows.forEach((row) => row.addEventListener('mouseenter', onEnter))
      ledger.addEventListener('mouseleave', onLeave)
      return () => {
        rows.forEach((row) => row.removeEventListener('mouseenter', onEnter))
        ledger.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: root },
  )

  return (
    <section className="close" id="answer" ref={root} data-nav-glass aria-labelledby="close-title">
      <header className="close__head">
        <p className="close__label fade-up">
          <span className="eyebrow close__index">{close.index}</span>
          <span className="close__dot" aria-hidden="true" />
          {close.label}
        </p>
        <p className="eyebrow close__disciplines fade-up">(Strategy · Brand · Technology)</p>
      </header>

      <h2 className="display close__title" id="close-title" aria-label={`${close.headline.a} ${close.headline.b}`}>
        <span className="line-mask close__a" aria-hidden="true">
          <span className="line-inner">{close.headline.a}</span>
        </span>
        <span className="close__span" aria-hidden="true">
          <span className="close__measure">
            <span className="close__tick" />
            <span className="close__line" />
            <span className="close__tick" />
            <span className="eyebrow close__readout">Gap 100%</span>
          </span>
        </span>
        <span className="line-mask close__b" aria-hidden="true">
          <span className="line-inner">{close.headline.b}</span>
        </span>
      </h2>

      <div className="close__intro">
        <p className="eyebrow close__note fade-up">{close.note}</p>
        <p className="close__sub fade-up">{close.sub}</p>
      </div>

      <ol className="close__ledger">
        {close.rows.map((row, i) => (
          <li className="crow" key={row.key}>
            <span className="crow__rule" aria-hidden="true" />
            <div className="crow__content">
              <span className="eyebrow crow__index">{String(i + 1).padStart(2, '0')}</span>

              <div className="crow__from">
                <span className="eyebrow crow__key">{row.key}</span>
                <span className="crow__gap">
                  <s>{row.gap}</s>
                  <span className="crow__strike" aria-hidden="true" />
                </span>
              </div>

              <svg className="crow__arrow" viewBox="0 0 64 12" aria-hidden="true">
                <path className="crow__arrow-line" d="M0 6 H62" pathLength={1} />
                <path className="crow__arrow-head" d="M56 1 L62 6 L56 11" />
              </svg>

              <div className="crow__to">
                <SplitLines as="h3" lines={[row.title]} className="display crow__title" />
                <p className="crow__body">{row.body}</p>
              </div>

              <span className="eyebrow crow__tag">{row.tag}</span>
            </div>
          </li>
        ))}
      </ol>

      <div className="close__cta">
        <span className="close__cta-rule" aria-hidden="true" />
        <SplitLines lines={close.cta.prompt} className="display close__prompt" />
        <div className="close__cta-side">
          <p className="close__cta-body fade-up">{close.cta.body}</p>
          <div className="fade-up">
            <MagneticButton {...leadFormLink('talk')} label={close.cta.button} size="lg" />
          </div>
        </div>
      </div>
    </section>
  )
}
