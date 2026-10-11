import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { Arrow } from '../ui/Arrow'
import { help } from '../../content/copy'
import { HelpVisuals, buildScene } from './HelpVisuals'
import './Help.css'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * What we can help with. Six disciplines on the right; the left panel shows a
 * live visual of the active one. Active = hover, else arrow choice, else scroll.
 */
export function Help() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'dark')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const items = q('.help__item') as HTMLElement[]
      const scenes = q('.hv__scene') as unknown as SVGGElement[]
      const infos = q('.help__info') as HTMLElement[]
      const counter = q('.help__count')[0] as HTMLElement
      const fill = q('.help__progress-fill')[0]
      const n = items.length
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const loops = scenes.map((g, i) => buildScene(i, g))

      /* ---------- Active state ---------- */
      let hover: number | null = null
      let manual: number | null = null
      let scroll = 0
      let active = -1

      const render = () => {
        const next = hover ?? manual ?? scroll
        if (next === active) return
        const prev = active
        active = next
        counter.textContent = `${pad(next + 1)}/${pad(n)}`
        gsap.to(fill, { scaleX: (next + 1) / n, duration: 0.6, ease: EASE.move })
        items.forEach((it, i) => {
          it.setAttribute('aria-current', String(i === next))
          gsap.to(it.querySelector('.help__name'), {
            color: i === next ? 'rgba(250,250,250,1)' : 'rgba(250,250,250,0.2)',
            duration: 0.45,
            ease: EASE.move,
            overwrite: 'auto',
          })
        })
        // Visual: crossfade scenes and restart the active loop.
        scenes.forEach((g, i) => {
          if (i === next) {
            gsap.to(g, { autoAlpha: 1, duration: 0.5, ease: EASE.move, overwrite: true })
            if (reduced) loops[i].progress(0.98).pause()
            else loops[i].restart()
          } else {
            gsap.to(g, { autoAlpha: 0, duration: 0.35, ease: EASE.move, overwrite: true, onComplete: () => { loops[i].pause() } })
          }
        })
        // Info: the outgoing line slips up, the new one rises in.
        // overwrite: true kills every earlier tween on each block, including delayed fade-ins
        // that have not started yet; with 'auto' those survived fast hovering and stacked up.
        infos.forEach((el, i) => {
          if (i === next) return
          gsap.to(el, { autoAlpha: 0, y: i === prev ? -10 : 0, duration: i === prev ? 0.3 : 0.2, ease: 'power2.in', overwrite: true })
        })
        gsap.fromTo(infos[next], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.55, delay: prev > -1 ? 0.15 : 0, ease: EASE.move, overwrite: true })
      }

      gsap.set(scenes, { autoAlpha: 0 })
      gsap.set(infos, { autoAlpha: 0 })
      render()

      /* ---------- Scroll drives the default ---------- */
      const setScroll = (i: number) => {
        if (i === scroll) return
        scroll = i
        manual = null
        render()
      }
      const mm = gsap.matchMedia()
      mm.add('(min-width: 901px)', () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          onUpdate: (self) => setScroll(Math.min(n - 1, Math.floor(self.progress * n))),
        })
      })
      mm.add('(max-width: 900px)', () => {
        items.forEach((it, i) =>
          ScrollTrigger.create({
            trigger: it,
            // Activation line sits just below the sticky panel.
            start: 'top 58%',
            end: 'bottom 58%',
            onToggle: (self) => self.isActive && setScroll(i),
          }),
        )
      })

      /* ---------- Entrance ---------- */
      gsap.set(q('.help .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.help__name-inner'), { yPercent: 110 })
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 60%', toggleActions: 'play none none none' } })
        .to(q('.help .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06, ease: EASE.move }, 0)
        .to(q('.help__name-inner'), { yPercent: 0, duration: 1.1, stagger: 0.07, ease: EASE.reveal }, 0.1)

      /* ---------- Inputs ---------- */
      const list = q('.help__list')[0] as HTMLElement
      const onEnter = (e: Event) => {
        hover = items.indexOf(e.currentTarget as HTMLElement)
        render()
      }
      const onClick = (e: Event) => {
        manual = items.indexOf(e.currentTarget as HTMLElement)
        render()
      }
      const onLeave = () => {
        hover = null
        render()
      }
      const canHover = !window.matchMedia('(hover: none)').matches
      items.forEach((it) => {
        if (canHover) it.addEventListener('mouseenter', onEnter)
        it.addEventListener('click', onClick)
        it.addEventListener('focus', onClick)
      })
      if (canHover) list.addEventListener('mouseleave', onLeave)

      const step = (dir: 1 | -1) => () => {
        manual = ((hover ?? manual ?? scroll) + dir + n) % n
        hover = null
        render()
      }
      const prevBtn = q('.help__ctrl--prev')[0]
      const nextBtn = q('.help__ctrl--next')[0]
      const onPrev = step(-1)
      const onNext = step(1)
      prevBtn.addEventListener('click', onPrev)
      nextBtn.addEventListener('click', onNext)

      return () => {
        loops.forEach((t) => t.kill())
        items.forEach((it) => {
          it.removeEventListener('mouseenter', onEnter)
          it.removeEventListener('click', onClick)
          it.removeEventListener('focus', onClick)
        })
        list.removeEventListener('mouseleave', onLeave)
        prevBtn.removeEventListener('click', onPrev)
        nextBtn.removeEventListener('click', onNext)
      }
    },
    { scope: root },
  )

  return (
    <section className="help" id="services" ref={root} data-nav-glass aria-labelledby="help-title">
      <div className="help__inner">
        <aside className="help__panel" aria-live="polite">
          <div className="help__progress fade-up">
            <button type="button" className="help__ctrl help__ctrl--prev" aria-label="Previous discipline">
              <Arrow />
            </button>
            <button type="button" className="help__ctrl help__ctrl--next" aria-label="Next discipline">
              <Arrow />
            </button>
            <span className="help__progress-track" aria-hidden="true">
              <span className="help__progress-fill" />
            </span>
            <span className="eyebrow help__count">01/{pad(help.items.length)}</span>
          </div>

          <div className="help__visual fade-up">
            <HelpVisuals />
          </div>

          <div className="help__infos fade-up">
            {help.items.map((it) => (
              <div className="help__info" key={it.name}>
                <p className="help__line">{it.line}</p>
                <p className="eyebrow help__includes">
                  {it.includes.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </aside>

        <div className="help__main">
          <header className="help__head">
            <p className="help__label fade-up" id="help-title">
              <span className="eyebrow help__index">{help.index}</span>
              <span className="help__dot" aria-hidden="true" />
              {help.label}
            </p>
            <p className="eyebrow help__note fade-up">{help.note}</p>
          </header>

          <ul className="help__list">
            {help.items.map((it, i) => (
              <li key={it.name}>
                <button type="button" className="help__item" aria-current={i === 0}>
                  <span className="eyebrow help__num">{pad(i + 1)}</span>
                  <span className="display help__name">
                    <span className="help__name-inner">{it.name}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
