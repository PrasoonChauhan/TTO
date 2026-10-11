import { useRoll } from '../../hooks/useRoll'
import { Arrow } from '../ui/Arrow'
import { TopicIcon } from './TopicIcon'
import { InsightCover } from './InsightCover'
import { formatDate, insightHref, topicById, type Insight } from '../../content/insights'

type Props = { a: Insight; lead?: boolean; issue?: number }

/** Article card. `lead` is the large block at the top of the Insights page. */
export function InsightCard({ a, lead = false, issue }: Props) {
  const { roll, arrows, enter, leave } = useRoll()
  const topic = topicById(a.topic)!
  return (
    <article className={`icard${lead ? ' icard--lead' : ''}`}>
      <a href={insightHref(a)} className="icard__link" onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}>
        <div className="icard__cover">
          <InsightCover a={a} index={issue} />
        </div>
        <div className="icard__body">
          <p className="icard__meta">
            <span className="eyebrow icard__topic">
              <TopicIcon topic={a.topic} />
              {topic.label}
            </span>
            <span className="eyebrow icard__date">
              <time dateTime={a.date}>{formatDate(a.date)}</time> · {a.minutes} min
            </span>
          </p>
          <h3 className="display icard__title">{a.title}</h3>
          <p className="icard__excerpt">{a.excerpt}</p>
          <span className="icard__cta" aria-hidden="true">
            <span className="icard__cta-reel">
              <span className="icard__cta-roll" ref={roll}>
                <span>Read the note</span>
                <span className="icard__cta-twin">Read the note</span>
              </span>
            </span>
            <span className="icard__cta-tile">
              <span className="icard__cta-arrows" ref={arrows}>
                <span className="icard__cta-arrow">
                  <Arrow />
                </span>
                <span className="icard__cta-arrow icard__cta-arrow--twin">
                  <Arrow />
                </span>
              </span>
            </span>
          </span>
        </div>
      </a>
    </article>
  )
}
