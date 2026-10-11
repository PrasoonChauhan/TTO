import { brandList } from '../Brands/logos'
import { Arrow } from '../ui/Arrow'
import { useRoll } from '../../hooks/useRoll'
import type { Founder, Review } from './reviewData'
import { ICONS } from '../Footer/brandIcons'

const markFor = (company: string) => brandList.find((b) => b.name === company)?.mark

/** The whole review flows on the card and is trimmed to fit; the dialog shows it in full. */
const excerpt = (body: string) => body.replace(/\n\n/g, ' ')

/** Photo, name and role. A LinkedIn link when the founder has a profile. */
export function FounderLink({ founder }: { founder: Founder }) {
  const variant = 'card'
  const inner = (
    <>
      <img className="rcard__photo" src={founder.photo} alt="" loading="lazy" width={128} height={128} />
      <span className="rcard__who">
        <span className="rcard__name">{founder.name}</span>
        <span className="rcard__role">
          {founder.role}, {founder.company}
        </span>
      </span>
      {founder.linkedin && (
        <span className="rcard__in" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d={ICONS.linkedin} />
          </svg>
        </span>
      )}
    </>
  )
  if (!founder.linkedin) return <div className={`founder founder--${variant}`}>{inner}</div>
  return (
    <a
      className={`founder founder--${variant} founder--link`}
      href={founder.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${founder.name}, ${founder.role} at ${founder.company}, on LinkedIn`}
    >
      {inner}
    </a>
  )
}

type Props = { review: Review; index: number; onOpen: (index: number) => void }

/**
 * One review. Text and video share the same frame so they can sit side by side
 * in any order. The whole card opens the dialog via a stretched button.
 */
export function ReviewCard({ review, index, onOpen }: Props) {
  const { roll, arrows, enter, leave } = useRoll()
  const { founder } = review
  const isVideo = review.kind === 'video'
  const label = isVideo ? 'Watch the review' : 'Read full review'

  return (
    <article className={`rcard rcard--${review.kind}`} onMouseEnter={enter} onMouseLeave={leave}>
      {isVideo && (
        <div className="rcard__poster" aria-hidden="true">
          <img src={review.poster} alt="" loading="lazy" />
          <span className="rcard__play">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
          <span className="eyebrow rcard__duration">{review.duration}</span>
        </div>
      )}

      <header className="rcard__top">
        <span className="rcard__logo" aria-hidden="true">{markFor(founder.company)}</span>
        <span className="eyebrow rcard__company">{founder.company}</span>
        {!isVideo && (
          <span className="rcard__quote" aria-hidden="true">
            “
          </span>
        )}
      </header>

      <p className="display rcard__headline">{review.headline}</p>

      {!isVideo && (
        <div className="rcard__body-wrap">
          <p className="rcard__body">{excerpt(review.body)}</p>
        </div>
      )}

      <button
        type="button"
        className="rcard__open"
        onClick={() => onOpen(index)}
        onFocus={enter}
        onBlur={leave}
        aria-label={`${label}: ${founder.name}, ${founder.company}`}
      >
        <span className="rcard__open-reel" aria-hidden="true">
          <span className="rcard__open-roll" ref={roll}>
            <span>{label}</span>
            <span className="rcard__open-twin">{label}</span>
          </span>
        </span>
        <span className="rcard__open-tile" aria-hidden="true">
          <span className="rcard__open-arrows" ref={arrows}>
            <span className="rcard__open-arrow">
              <Arrow />
            </span>
            <span className="rcard__open-arrow rcard__open-arrow--twin">
              <Arrow />
            </span>
          </span>
        </span>
      </button>

      {/* Founder strip: sits above the card's open-review area and links to LinkedIn. */}
      <footer className="rcard__founder">
        <FounderLink founder={founder} />
      </footer>
    </article>
  )
}
