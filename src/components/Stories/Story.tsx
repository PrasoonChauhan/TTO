import { useRef, type CSSProperties } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE } from '../../lib/gsap'
import { Arrow } from '../ui/Arrow'
import { Slides, SLIDE_TITLES } from './Slides'
import type { Story as StoryData } from './storyData'

/** Seconds each slide holds while playing. The first step is quicker so hover feels responsive. */
const HOLD = 2.8
const FIRST_HOLD = 1.1
const WIPE = { duration: 0.85, ease: 'power3.inOut' }

const format = (v: number, decimals = 0) => v.toFixed(decimals)

export function Story({ story }: { story: StoryData }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const frame = q('.story__frame')[0] as HTMLElement
      const slides = q('.deck__slide') as HTMLElement[]
      const fills = q('.story__bar-fill') as HTMLElement[]
      const caption = q('.story__caption-text')[0] as HTMLElement
      const hint = q('.story__hint')[0]
      const controls = q('.story__controls')[0]
      const n = slides.length
      const touch = window.matchMedia('(hover: none)').matches
      if (touch) hint.textContent = '(Plays in view. Tap arrows to browse)'

      /* ---------- Deck state ---------- */
      let index = 0
      let timer: gsap.core.Tween | null = null
      let hovering = false

      const paintBars = (fullCurrent: boolean) =>
        fills.forEach((f, k) => gsap.set(f, { scaleX: k < index ? 1 : k === index && fullCurrent ? 1 : 0 }))

      const settle = () => {
        slides.forEach((s, k) => {
          s.setAttribute('aria-hidden', String(k !== index))
          if (k !== index) gsap.set(s, { autoAlpha: 0, zIndex: 0 })
        })
      }

      const show = (i: number, dir: 1 | -1) => {
        if (i === index) return
        const prev = slides[index]
        const next = slides[i]
        index = i
        caption.textContent = SLIDE_TITLES[i]
        gsap.set(prev, { zIndex: 1 })
        gsap.set(next, {
          autoAlpha: 1,
          zIndex: 2,
          clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
        })
        // New slide wipes across; the outgoing one drifts back a touch for depth.
        gsap.to(next, { clipPath: 'inset(0% 0% 0% 0%)', ...WIPE, overwrite: true, onComplete: settle })
        gsap.fromTo(prev.firstElementChild, { xPercent: 0 }, {
          xPercent: -8 * dir,
          ...WIPE,
          onComplete: () => { gsap.set(prev.firstElementChild, { xPercent: 0 }) },
        })
      }

      const play = (hold = HOLD) => {
        timer?.kill()
        timer = gsap.fromTo(fills[index], { scaleX: 0 }, {
          scaleX: 1,
          duration: hold,
          ease: 'none',
          onComplete: () => {
            show((index + 1) % n, 1)
            if (index === 0) paintBars(false)
            play()
          },
        })
      }

      const manual = (i: number, dir: 1 | -1) => {
        timer?.kill()
        timer = null
        show(((i % n) + n) % n, dir)
        paintBars(true)
      }

      const reset = () => {
        timer?.kill()
        timer = null
        index = 0
        caption.textContent = SLIDE_TITLES[0]
        slides.forEach((s, k) => gsap.set(s, { autoAlpha: k === 0 ? 1 : 0, zIndex: k === 0 ? 1 : 0, clipPath: 'inset(0% 0% 0% 0%)' }))
        settle()
        paintBars(false)
        gsap.to(hint, { autoAlpha: 1, duration: 0.4 })
      }
      reset()

      const enter = () => {
        hovering = true
        gsap.to(hint, { autoAlpha: 0, duration: 0.3 })
        if (!touch) gsap.to(controls, { autoAlpha: 1, duration: 0.35, ease: EASE.move })
        if (timer && timer.paused()) timer.resume()
        else if (!timer) play(index === 0 ? FIRST_HOLD : HOLD)
      }
      const leave = () => {
        hovering = false
        timer?.pause()
        if (!touch) gsap.to(controls, { autoAlpha: 0, duration: 0.35, ease: EASE.move })
      }

      /* ---------- Inputs ---------- */
      if (!touch) gsap.set(controls, { autoAlpha: 0 })
      frame.addEventListener('mouseenter', enter)
      frame.addEventListener('mouseleave', leave)

      const prevBtn = q('.story__ctrl--prev')[0] as HTMLElement
      const nextBtn = q('.story__ctrl--next')[0] as HTMLElement
      const onPrev = () => manual(index - 1, -1)
      const onNext = () => manual(index + 1, 1)
      prevBtn.addEventListener('click', onPrev)
      nextBtn.addEventListener('click', onNext)

      const bars = q('.story__bar') as HTMLElement[]
      const onBar = (e: Event) => {
        const i = bars.indexOf(e.currentTarget as HTMLElement)
        manual(i, i >= index ? 1 : -1)
      }
      bars.forEach((b) => b.addEventListener('click', onBar))

      const onKey = (e: KeyboardEvent) => {
        if (!hovering && !frame.contains(document.activeElement)) return
        if (e.key === 'ArrowRight') { e.preventDefault(); onNext() }
        if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev() }
      }
      window.addEventListener('keydown', onKey)

      // Start fresh whenever the story leaves the screen.
      ScrollTrigger.create({ trigger: frame, start: 'top bottom', end: 'bottom top', onLeave: reset, onLeaveBack: reset })
      // Touch screens have no hover: play while the deck is well in view.
      if (touch) {
        ScrollTrigger.create({
          trigger: frame,
          start: 'top 65%',
          end: 'bottom 35%',
          onToggle: (self) => (self.isActive ? enter() : leave()),
        })
      }

      /* ---------- Reveal (PRD 4D): block slides away, then data arrives ---------- */
      gsap.set(q('.story__info .fade-up'), { autoAlpha: 0, y: 18 })
      gsap.set(q('.story__name .line-inner'), { yPercent: 140 })
      const values = q('.story__metric-value') as HTMLElement[]
      const reveal = gsap.timeline({
        scrollTrigger: { trigger: frame, start: 'top 80%', toggleActions: 'play none none none' },
      })
      reveal
        .to(q('.story__veil'), { yPercent: -101, duration: 1.2, ease: 'power4.inOut' })
        .to(q('.story__name .line-inner'), { yPercent: 0, duration: 1.1, ease: EASE.reveal }, '>-0.15')
        .to(q('.story__info .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE.move }, '<0.15')
      story.metrics.forEach((m, i) => {
        const counter = { v: 0 }
        reveal.to(counter, {
          v: m.value,
          duration: 1.4,
          ease: 'power3.out',
          onUpdate: () => {
            values[i].textContent = `${m.prefix ?? ''}${format(counter.v, m.decimals)}${m.suffix ?? ''}`
          },
        }, '<0.1')
      })

      /* ---------- Internal parallax (PRD 3) ---------- */
      gsap.fromTo(
        q('.story__media'),
        { scale: 1.12, yPercent: -4 },
        { scale: 1, yPercent: 4, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
      )

      return () => {
        frame.removeEventListener('mouseenter', enter)
        frame.removeEventListener('mouseleave', leave)
        prevBtn.removeEventListener('click', onPrev)
        nextBtn.removeEventListener('click', onNext)
        bars.forEach((b) => b.removeEventListener('click', onBar))
        window.removeEventListener('keydown', onKey)
        timer?.kill()
      }
    },
    { scope: root },
  )

  const { gapClosed: g } = story

  return (
    <article className="story" id={`story-${story.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} ref={root} style={{ '--bar': story.palette.ink, '--bar-bg': story.palette.bg } as CSSProperties}>
      <div
        className="story__frame"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${story.brand} story slides. Hover to play, use arrow keys to browse.`}
      >
        <div className="story__media deck">
          <Slides story={story} />
        </div>

        <div className="story__bars">
          {SLIDE_TITLES.map((t) => (
            <button className="story__bar" key={t} aria-label={`Show slide: ${t}`}>
              <span className="story__bar-fill" />
            </button>
          ))}
        </div>

        <div className="story__caption">
          <span className="eyebrow story__caption-text">{SLIDE_TITLES[0]}</span>
          <span className="eyebrow story__hint">(Hover to play)</span>
        </div>

        <div className="story__controls">
          <button className="story__ctrl story__ctrl--prev" aria-label="Previous slide">
            <Arrow />
          </button>
          <button className="story__ctrl story__ctrl--next" aria-label="Next slide">
            <Arrow />
          </button>
        </div>

        <div className="story__veil" aria-hidden="true" />
      </div>

      {/* Spans exactly the frame height: story at the top, numbers on the frame's bottom edge. */}
      <div className="story__info">
        <div className="story__info-top">
          <p className="eyebrow story__sector fade-up">{story.sector}</p>
          <h3 className="display story__name" aria-label={story.brand}>
            <span className="line-mask" aria-hidden="true">
              <span className="line-inner">{story.brand}</span>
            </span>
          </h3>
          <p className="story__summary fade-up">{story.summary}</p>

          <div className="story__gap fade-up">
            <span className="eyebrow story__gap-label">Gap closed</span>
            <span className="story__gap-value">
              {g.key}: <s>{g.from}</s> <span aria-hidden="true">→</span> {g.to}
            </span>
          </div>
        </div>

        <dl className="story__metrics">
          {story.metrics.map((m) => (
            <div className="story__metric fade-up" key={m.label}>
              <dt className="display story__metric-value">
                {m.prefix ?? ''}
                {format(0, m.decimals)}
                {m.suffix ?? ''}
              </dt>
              <dd className="story__metric-label">{m.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}
