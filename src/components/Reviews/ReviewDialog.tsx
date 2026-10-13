import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, EASE } from '../../lib/gsap'
import { getLenis } from '../../lib/smoothScroll'
import { markFor } from '../Brands/logos'
import { workByBrand, storyHref } from '../../content/work'
import { Arrow } from '../ui/Arrow'
import type { Review } from './reviewData'

/** Link to the founder's story: on home if featured there, otherwise on /work/. */
const storyAnchor = (company: string) => {
  const w = workByBrand(company)
  return w ? storyHref(w) : null
}

type Props = {
  reviews: Review[]
  index: number | null
  onIndex: (i: number | null) => void
}

/**
 * Full review. Native <dialog> gives focus trapping, Escape and screen-reader
 * semantics; GSAP handles the motion. Prev/next browse without closing.
 */
export function ReviewDialog({ reviews, index, onIndex }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const scrim = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  // Keep showing the last review while the close animation plays.
  const [shown, setShown] = useState<number | null>(index)
  const closing = useRef(false)

  /* Open */
  useLayoutEffect(() => {
    const d = dialog.current
    if (index === null || !d) return
    setShown(index)
    if (d.open) return
    d.showModal()
    getLenis()?.stop()
    closing.current = false
    gsap.fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: EASE.move })
    gsap.fromTo(
      panel.current,
      { y: 40, opacity: 0, clipPath: 'inset(8% 0% 0% 0% round 6px)' },
      { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 0.8, ease: EASE.reveal },
    )
  }, [index])

  /* Content swap when browsing inside the dialog */
  useEffect(() => {
    if (shown === null || !content.current) return
    gsap.fromTo(content.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: EASE.move })
    content.current.querySelector<HTMLElement>('.rdialog__scroll')?.scrollTo({ top: 0 })
  }, [shown])

  const close = (after?: () => void) => {
    const d = dialog.current
    if (!d || closing.current) return
    closing.current = true
    d.querySelector('video')?.pause()
    gsap.to(panel.current, { y: 24, opacity: 0, duration: 0.35, ease: 'power2.in' })
    gsap.to(scrim.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        d.close()
        getLenis()?.start()
        onIndex(null)
        after?.()
      },
    })
  }

  // Escape: animate out instead of the abrupt native close.
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (!d.open || shown === null) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    d.addEventListener('cancel', onCancel)
    window.addEventListener('keydown', onKey)
    return () => {
      d.removeEventListener('cancel', onCancel)
      window.removeEventListener('keydown', onKey)
    }
  })

  const go = (dir: 1 | -1) => {
    if (shown === null) return
    const next = (shown + dir + reviews.length) % reviews.length
    dialog.current?.querySelector('video')?.pause()
    onIndex(next)
  }

  const review = shown === null ? null : reviews[shown]
  const anchor = review ? storyAnchor(review.founder.company) : null

  const toStory = () => {
    if (!anchor) return
    close(() => {
      const url = new URL(anchor, window.location.href)
      const el = url.pathname === window.location.pathname ? document.querySelector<HTMLElement>(url.hash) : null
      if (el) getLenis()?.scrollTo(el, { offset: -100, duration: 2 })
      else window.location.href = anchor
    })
  }

  return (
    <dialog className="rdialog" ref={dialog} aria-label={review ? `Review from ${review.founder.name}` : 'Review'}>
      <div className="rdialog__scrim" ref={scrim} onClick={() => close()} />
      <div className="rdialog__panel" ref={panel}>
        {review && (
          <div className={`rdialog__content rdialog__content--${review.kind}`} ref={content}>
            {review.kind === 'video' && (
              <div className="rdialog__video">
                <video key={review.id} src={review.src} poster={review.poster} controls autoPlay playsInline />
              </div>
            )}

            <aside className="rdialog__aside">
              {review.founder.linkedin ? (
                // display: contents keeps the existing layout; photo and name become one LinkedIn link.
                <a
                  className="rdialog__person"
                  href={review.founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${review.founder.name} on LinkedIn`}
                >
                  <img className="rdialog__photo" src={review.founder.photo} alt="" width={128} height={128} />
                  <span className="rdialog__name">{review.founder.name}</span>
                  <span className="rdialog__role">{review.founder.role}</span>
                  <span className="eyebrow rdialog__in">LinkedIn ↗</span>
                </a>
              ) : (
                <>
                  <img className="rdialog__photo" src={review.founder.photo} alt={review.founder.name} width={128} height={128} />
                  <p className="rdialog__name">{review.founder.name}</p>
                  <p className="rdialog__role">{review.founder.role}</p>
                </>
              )}
              <p className="rdialog__company">
                {markFor(review.founder.company) && (
                  <span className="rdialog__logo" aria-hidden="true">{markFor(review.founder.company)}</span>
                )}
                <span className="eyebrow">{review.founder.company}</span>
              </p>
              {anchor && (
                <button type="button" className="eyebrow rdialog__story" onClick={toStory}>
                  Read the {review.founder.company} story <Arrow />
                </button>
              )}
            </aside>

            <div className="rdialog__main">
              <p className="display rdialog__headline">{review.headline}</p>
              {review.kind === 'text' && (
                <div className="rdialog__scroll" data-lenis-prevent>
                  {review.body.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rdialog__bar">
          <button type="button" className="rdialog__nav rdialog__nav--prev" onClick={() => go(-1)} aria-label="Previous review">
            <Arrow />
          </button>
          <button type="button" className="rdialog__nav rdialog__nav--next" onClick={() => go(1)} aria-label="Next review">
            <Arrow />
          </button>
          <button type="button" className="eyebrow rdialog__close" onClick={() => close()}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}
