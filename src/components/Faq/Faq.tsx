import { useRef, useState, type FormEvent } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { useRoll } from '../../hooks/useRoll'
import { SplitLines } from '../ui/SplitLines'
import { Arrow } from '../ui/Arrow'
import { faq } from '../../content/copy'
import './Faq.css'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Questions. One open at a time. Each answer leads with a short verdict in the
 * display face, so the page can be scanned in seconds.
 */
export function Faq() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(0)
  const [question, setQuestion] = useState('')
  const send = useRoll()
  useSectionTheme(root, 'light')

  /* ---------- Entrance + hover ---------- */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.set(q('.faq__aside .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.faq__title .line-inner'), { yPercent: 140 })
      gsap.set(q('.fitem__rule'), { scaleX: 0 })
      gsap.set(q('.fitem__head'), { autoAlpha: 0, y: 14 })
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', toggleActions: 'play none none none' } })
        .to(q('.faq__title .line-inner'), { yPercent: 0, duration: 1.2, stagger: 0.1, ease: EASE.reveal }, 0)
        .to(q('.faq__aside .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE.move }, 0.2)
        .to(q('.fitem__rule'), { scaleX: 1, duration: 1, stagger: 0.06, ease: EASE.inOut }, 0.1)
        .to(q('.fitem__head'), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: EASE.move }, 0.3)

      if (window.matchMedia('(hover: none)').matches) return
      const items = q('.fitem') as HTMLElement[]
      const list = q('.faq__list')[0] as HTMLElement
      const quick = { duration: 0.4, ease: EASE.move, overwrite: 'auto' as const }
      const onEnter = (e: Event) =>
        items.forEach((it) => gsap.to(it.querySelector('.fitem__q'), { opacity: it === e.currentTarget ? 1 : 0.4, ...quick }))
      const onLeave = () => gsap.to(q('.fitem__q'), { opacity: 1, ...quick })
      items.forEach((it) => it.addEventListener('mouseenter', onEnter))
      list.addEventListener('mouseleave', onLeave)
      return () => {
        items.forEach((it) => it.removeEventListener('mouseenter', onEnter))
        list.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: root },
  )

  /* ---------- Open / close ---------- */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      ;(q('.fitem') as HTMLElement[]).forEach((it, i) => {
        const panel = it.querySelector('.fitem__panel')
        const isOpen = i === open
        gsap.to(panel, {
          height: isOpen ? 'auto' : 0,
          duration: isOpen ? 0.7 : 0.5,
          ease: isOpen ? EASE.inOut : 'power3.inOut',
          overwrite: true,
          // Page height changed: re-measure everything below.
          onComplete: () => ScrollTrigger.refresh(),
        })
        gsap.to(it.querySelector('.fitem__icon'), { rotation: isOpen ? 45 : 0, duration: 0.5, ease: EASE.move, overwrite: true })
        if (isOpen) {
          gsap.fromTo(it.querySelector('.fitem__short .line-inner'), { yPercent: 140 }, { yPercent: 0, duration: 0.9, delay: 0.15, ease: EASE.reveal })
          gsap.fromTo(it.querySelector('.fitem__a'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.3, ease: EASE.move })
        }
      })
    },
    { scope: root, dependencies: [open] },
  )

  const onAsk = (e: FormEvent) => {
    e.preventDefault()
    const text = question.trim()
    if (!text) return
    const subject = encodeURIComponent('A question for The Third Orbit')
    const body = encodeURIComponent(text)
    window.location.href = `mailto:${faq.ask.email}?subject=${subject}&body=${body}`
  }

  return (
    <section className="faq" id="faq" ref={root} data-nav-glass aria-labelledby="faq-title">
      <div className="faq__inner">
        <aside className="faq__aside">
          <div className="faq__sticky">
            <p className="faq__label fade-up" id="faq-title">
              <span className="eyebrow faq__index">{faq.index}</span>
              <span className="faq__dot" aria-hidden="true" />
              {faq.label}
            </p>
            <SplitLines as="h2" lines={faq.title} className="display faq__title" />
            <p className="faq__sub fade-up">{faq.sub}</p>

            <form className="faq__ask fade-up" onSubmit={onAsk}>
              <label className="eyebrow faq__ask-label" htmlFor="faq-ask">
                {faq.ask.label}
              </label>
              <div className="faq__ask-row">
                <input
                  id="faq-ask"
                  className="faq__ask-input"
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={faq.ask.placeholder}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="faq__ask-send"
                  disabled={!question.trim()}
                  onMouseEnter={send.enter}
                  onMouseLeave={send.leave}
                  aria-label={faq.ask.button}
                >
                  <span className="faq__ask-arrows" ref={send.arrows}>
                    <span className="faq__ask-arrow">
                      <Arrow />
                    </span>
                    <span className="faq__ask-arrow faq__ask-arrow--twin">
                      <Arrow />
                    </span>
                  </span>
                </button>
              </div>
              <p className="eyebrow faq__ask-note">{faq.ask.note}</p>
            </form>
          </div>
        </aside>

        <ol className="faq__list">
          {faq.items.map((it, i) => {
            const isOpen = i === open
            return (
              <li className={`fitem${isOpen ? ' is-open' : ''}`} key={it.q}>
                <span className="fitem__rule" aria-hidden="true" />
                <h3 className="fitem__head">
                  <button
                    type="button"
                    className="fitem__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="eyebrow fitem__num">{pad(i + 1)}</span>
                    <span className="fitem__text">{it.q}</span>
                    <span className="fitem__icon" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                </h3>
                <div className="fitem__panel" id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                  <div className="fitem__answer">
                    <p className="display fitem__short">
                      <span className="line-mask">
                        <span className="line-inner">{it.short}</span>
                      </span>
                    </p>
                    <p className="fitem__a">{it.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
