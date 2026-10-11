import { useRef, type CSSProperties } from 'react'
import { gsap, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { SplitLines } from '../ui/SplitLines'
import { brands } from '../../content/copy'
import { brandList } from './logos'
import './Brands.css'

/**
 * Brands we've helped. The first section after arrival, so it stays in the void:
 * these are the companies already in their third orbit.
 */
export function Brands() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'dark')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const cells = q('.bcell') as HTMLElement[]

      /* ---------- Entrance ---------- */
      gsap.set(q('.brands__title .line-inner'), { yPercent: 140 })
      gsap.set(q('.brands .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.bcell__rule--b, .brands__rule'), { scaleX: 0 })
      gsap.set(q('.bcell__rule--r'), { scaleY: 0 })
      gsap.set(q('.bcell__logo, .bcell__index, .bcell__caption'), { autoAlpha: 0, y: 18 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 72%', toggleActions: 'play none none none' },
      })
      tl.to(q('.brands__title .line-inner'), { yPercent: 0, duration: 1.3, stagger: 0.1, ease: EASE.reveal }, 0)
        .to(q('.brands .fade-up'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: EASE.move }, 0.3)
        .to(q('.brands__rule'), { scaleX: 1, duration: 1.4, ease: EASE.inOut }, 0.2)
        .to(q('.bcell__rule--b'), { scaleX: 1, duration: 1.2, stagger: 0.05, ease: EASE.inOut }, 0.4)
        .to(q('.bcell__rule--r'), { scaleY: 1, duration: 1.2, stagger: 0.05, ease: EASE.inOut }, 0.5)
        .to(q('.bcell__logo'), { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.07, ease: EASE.reveal }, 0.7)
        .to(q('.bcell__index, .bcell__caption'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.03, ease: EASE.move }, 0.95)

      /* ---------- Hover: lock-on ---------- */
      if (window.matchMedia('(hover: none)').matches) return
      const quick = { duration: 0.4, ease: EASE.move, overwrite: 'auto' as const }

      const focus = (active: HTMLElement) => {
        cells.forEach((c) => {
          const on = c === active
          gsap.to(c.querySelector('.bcell__content'), { opacity: on ? 1 : 0.28, ...quick })
          gsap.to(c.querySelector('.bcell__logo'), { scale: on ? 1.04 : 1, ...quick })
          gsap.to(c.querySelectorAll('.bcell__corner'), on ? { opacity: 1, x: 0, y: 0, ...quick } : { opacity: 0, ...quick })
        })
      }

      const reset = () => {
        cells.forEach((c) => {
          gsap.to(c.querySelector('.bcell__content'), { opacity: 1, ...quick })
          gsap.to(c.querySelector('.bcell__logo'), { scale: 1, ...quick })
          gsap.to(c.querySelectorAll('.bcell__corner'), { opacity: 0, ...quick })
        })
      }

      // Corners start slightly outside the cell and settle inward on focus.
      cells.forEach((c) => {
        c.querySelectorAll<HTMLElement>('.bcell__corner').forEach((k) => {
          const dx = k.classList.contains('is-l') ? -6 : 6
          const dy = k.classList.contains('is-t') ? -6 : 6
          gsap.set(k, { opacity: 0, x: dx, y: dy })
        })
      })

      const grid = q('.brands__grid')[0] as HTMLElement
      const onEnter = (e: Event) => focus(e.currentTarget as HTMLElement)
      const onLeaveCell = (e: Event) => {
        // Re-park this cell's corners outside so the next focus settles inward again.
        ;(e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('.bcell__corner').forEach((k) => {
          const dx = k.classList.contains('is-l') ? -6 : 6
          const dy = k.classList.contains('is-t') ? -6 : 6
          gsap.to(k, { opacity: 0, x: dx, y: dy, ...quick })
        })
      }
      cells.forEach((c) => {
        c.addEventListener('mouseenter', onEnter)
        c.addEventListener('mouseleave', onLeaveCell)
      })
      grid.addEventListener('mouseleave', reset)
      return () => {
        cells.forEach((c) => {
          c.removeEventListener('mouseenter', onEnter)
          c.removeEventListener('mouseleave', onLeaveCell)
        })
        grid.removeEventListener('mouseleave', reset)
      }
    },
    { scope: root },
  )

  return (
    <section className="brands" id="brands" ref={root} data-nav-glass="top bottom" aria-labelledby="brands-title">
      <div className="brands__inner">
        <aside className="brands__aside">
          {/* The track bounds the sticky intro so it always stops above the note. */}
          <div className="brands__track">
            <div className="brands__intro">
              <p className="eyebrow brands__index fade-up">{brands.index}</p>
              <SplitLines as="h2" lines={brands.title} className="display brands__title" />
              <p className="brands__body fade-up">{brands.body}</p>
            </div>
          </div>
          <p className="brands__note fade-up">{brands.note}</p>
        </aside>

        <div className="brands__main">
          <header className="brands__head">
            <p className="brands__label fade-up" id="brands-title">
              <span className="brands__dot" aria-hidden="true" />
              {brands.label}
            </p>
            <p className="eyebrow brands__count fade-up">
              {String(brandList.length).padStart(2, '0')} partners
            </p>
            <span className="brands__rule" aria-hidden="true" />
          </header>

          <ul className="brands__grid">
            {brandList.map((b, i) => (
              <li className="bcell" key={b.name}>
                <div className="bcell__content">
                  <span className="eyebrow bcell__index">{String(i + 1).padStart(2, '0')}</span>
                  <div className="bcell__logo" style={{ '--logo-scale': b.scale } as CSSProperties} role="img" aria-label={b.name}>
                    {b.mark}
                  </div>
                  <span className="eyebrow bcell__caption">{b.caption}</span>
                </div>
                <span className="bcell__rule bcell__rule--b" aria-hidden="true" />
                <span className="bcell__rule bcell__rule--r" aria-hidden="true" />
                <span className="bcell__corner is-t is-l" aria-hidden="true" />
                <span className="bcell__corner is-t is-r" aria-hidden="true" />
                <span className="bcell__corner is-b is-l" aria-hidden="true" />
                <span className="bcell__corner is-b is-r" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
