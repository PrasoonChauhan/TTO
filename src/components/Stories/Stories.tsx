import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../../lib/gsap'
import { useSectionTheme } from '../../hooks/useSectionTheme'
import { useRoll } from '../../hooks/useRoll'
import { Arrow } from '../ui/Arrow'
import { storiesCopy } from '../../content/copy'
import { stories } from './storyData'
import { Story } from './Story'
import './Stories.css'

/** Home page shows four stories; the rest live behind "View all stories". */
const HOME_COUNT = 4

/**
 * Success stories. Each story is a self-playing slide deck, so the home page
 * can tell the whole case without separate story pages.
 */
export function Stories() {
  const root = useRef<HTMLElement>(null)
  const all = useRoll()
  useSectionTheme(root, 'light')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.set(q('.stories__aside .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.to(q('.stories__aside .fade-up'), {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: EASE.move,
        scrollTrigger: { trigger: root.current, start: 'top 75%', toggleActions: 'play none none none' },
      })

      gsap.set(q('.stories__all-rule'), { scaleX: 0 })
      gsap.set(q('.stories__all-label .line-inner'), { yPercent: 140 })
      gsap.set(q('.stories__all-tile'), { autoAlpha: 0, scale: 0.8 })
      gsap
        .timeline({ scrollTrigger: { trigger: q('.stories__all')[0], start: 'top 88%', toggleActions: 'play none none none' } })
        .to(q('.stories__all-rule'), { scaleX: 1, duration: 1.2, ease: EASE.inOut }, 0)
        .to(q('.stories__all-label .line-inner'), { yPercent: 0, duration: 1.1, ease: EASE.reveal }, 0.25)
        .to(q('.stories__all-tile'), { autoAlpha: 1, scale: 1, duration: 0.8, ease: EASE.move }, 0.45)
    },
    { scope: root },
  )

  return (
    <section className="stories" id="work" ref={root} data-nav-glass aria-labelledby="stories-title">
      <div className="stories__grid">
        <aside className="stories__aside">
          <div className="stories__sticky">
            <p className="stories__label fade-up" id="stories-title">
              <span className="eyebrow stories__index">{storiesCopy.index}</span>
              <span className="stories__dot" aria-hidden="true" />
              {storiesCopy.label}
            </p>
            <p className="stories__intro fade-up">{storiesCopy.intro}</p>
          </div>
        </aside>

        <div className="stories__list">
          {stories.slice(0, HOME_COUNT).map((s) => (
            <Story story={s} key={s.brand} />
          ))}
        </div>
      </div>

      <a
        className="stories__all"
        href={storiesCopy.all.href}
        onMouseEnter={all.enter}
        onMouseLeave={all.leave}
        onFocus={all.enter}
        onBlur={all.leave}
        aria-label={storiesCopy.all.label}
      >
        <span className="stories__all-rule" aria-hidden="true" />
        <span className="line-mask stories__all-label" aria-hidden="true">
          <span className="line-inner">
            <span className="stories__all-reel">
              <span className="stories__all-roll" ref={all.roll}>
                <span className="display stories__all-text">{storiesCopy.all.label}</span>
                <span className="display stories__all-text stories__all-text--twin">{storiesCopy.all.label}</span>
              </span>
            </span>
          </span>
        </span>
        <span className="stories__all-tile" aria-hidden="true">
          <span className="stories__all-arrows" ref={all.arrows}>
            <span className="stories__all-arrow">
              <Arrow strokeWidth={1.4} />
            </span>
            <span className="stories__all-arrow stories__all-arrow--twin">
              <Arrow strokeWidth={1.4} />
            </span>
          </span>
        </span>
      </a>
    </section>
  )
}
