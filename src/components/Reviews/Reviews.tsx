import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { surfaceCrossfade } from '../../lib/surface'
import { SplitLines } from '../ui/SplitLines'
import { reviewsCopy } from '../../content/copy'
import { reviews } from './reviewData'
import { ReviewCard } from './ReviewCard'
import { ReviewDialog } from './ReviewDialog'
import './Reviews.css'

/**
 * In their words. Founder reviews on a horizontal track: pinned and driven by
 * vertical scroll on desktop, a swipe carousel on small screens. Any number of
 * text or video cards fits; the track simply gets longer.
 */
export function Reviews() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  useSectionTheme(root, 'dark')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const track = q('.reviews__track')[0] as HTMLElement
      const cards = q('.rcard') as HTMLElement[]

      /* ---------- Dusk: daylight gives way to the void, whole screen ---------- */
      surfaceCrossfade(root.current!, 'dark')

      /* ---------- Entrance ---------- */
      gsap.set(q('.reviews__head .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.reviews__title .line-inner'), { yPercent: 140 })
      gsap.set(cards, { autoAlpha: 0, y: 40 })
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: 'top 45%', toggleActions: 'play none none none' } })
        .to(q('.reviews__head .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE.move }, 0)
        .to(q('.reviews__title .line-inner'), { yPercent: 0, duration: 1.2, stagger: 0.1, ease: EASE.reveal }, 0.1)
        .to(cards, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: EASE.reveal }, 0.35)

      /* ---------- Fit each excerpt to whole lines, ending in an ellipsis ---------- */
      const clamp = () =>
        q('.rcard__body-wrap').forEach((wrap) => {
          const body = wrap.firstElementChild as HTMLElement
          const lh = parseFloat(getComputedStyle(body).lineHeight)
          const lines = Math.max(2, Math.floor(wrap.clientHeight / lh))
          body.style.setProperty('-webkit-line-clamp', String(lines))
        })
      clamp()
      ScrollTrigger.addEventListener('refresh', clamp)

      /* ---------- Track ---------- */
      const fill = q('.reviews__progress-fill')[0]
      const mm = gsap.matchMedia()
      mm.add('(min-width: 901px)', () => {
        // Travel until the last card sits one gutter from the right edge, mirroring the left.
        const distance = () => {
          const last = track.lastElementChild as HTMLElement
          const end = last.getBoundingClientRect().right - track.getBoundingClientRect().left
          return Math.max(0, end + parseFloat(getComputedStyle(track).paddingRight) - track.clientWidth)
        }
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(fill, { scaleX: self.progress }),
          },
        })
      })
      mm.add('(max-width: 900px)', () => {
        const onScroll = () => {
          const max = track.scrollWidth - track.clientWidth
          gsap.set(fill, { scaleX: max > 0 ? track.scrollLeft / max : 1 })
        }
        track.addEventListener('scroll', onScroll, { passive: true })
        return () => track.removeEventListener('scroll', onScroll)
      })

      /* ---------- Hover: focus one card, dim the rest ---------- */
      if (window.matchMedia('(hover: none)').matches) return
      const quick = { duration: 0.4, ease: EASE.move, overwrite: 'auto' as const }
      const photo = (c: HTMLElement) => c.querySelector('.rcard__photo')
      // The focused founder steps forward: full strength, portrait in colour.
      const onEnter = (e: Event) =>
        cards.forEach((c) => {
          const on = c === e.currentTarget
          gsap.to(c, { opacity: on ? 1 : 0.4, ...quick })
          gsap.to(photo(c), { filter: on ? 'grayscale(0)' : 'grayscale(1)', ...quick })
        })
      const onLeave = () => {
        gsap.to(cards, { opacity: 1, ...quick })
        gsap.to(cards.map(photo), { filter: 'grayscale(1)', ...quick })
      }
      cards.forEach((c) => c.addEventListener('mouseenter', onEnter))
      track.addEventListener('mouseleave', onLeave)
      return () => {
        ScrollTrigger.removeEventListener('refresh', clamp)
        cards.forEach((c) => c.removeEventListener('mouseenter', onEnter))
        track.removeEventListener('mouseleave', onLeave)
      }
    },
    // Rebuild when the number of reviews changes, so the pinned track never keeps a stale length.
    { scope: root, dependencies: [reviews.length], revertOnUpdate: true },
  )

  return (
    <section className="reviews" id="reviews" ref={root} data-nav-glass aria-labelledby="reviews-title">
      <header className="reviews__head">
        <div className="reviews__intro">
          <p className="reviews__label fade-up" id="reviews-title">
            <span className="eyebrow reviews__index">{reviewsCopy.index}</span>
            <span className="reviews__dot" aria-hidden="true" />
            {reviewsCopy.label}
          </p>
          <SplitLines as="h2" lines={reviewsCopy.title} className="display reviews__title" />
        </div>
        <div className="reviews__meta fade-up">
          <p className="eyebrow reviews__hint">
            <span className="reviews__hint--wide">{reviewsCopy.hint}</span>
            <span className="reviews__hint--touch">{reviewsCopy.hintTouch}</span>
          </p>
          <span className="reviews__progress" aria-hidden="true">
            <span className="reviews__progress-fill" />
          </span>
        </div>
      </header>

      <div className="reviews__track" data-lenis-prevent-touch>
        {reviews.map((r, i) => (
          <ReviewCard review={r} index={i} onOpen={setOpen} key={r.id} />
        ))}
      </div>

      <ReviewDialog reviews={reviews} index={open} onIndex={setOpen} />
    </section>
  )
}
