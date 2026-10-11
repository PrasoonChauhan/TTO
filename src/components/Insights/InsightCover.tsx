import { TopicIcon } from './TopicIcon'
import { topicById, type Insight } from '../../content/insights'

/**
 * Cover for an article. Uses the uploaded `cover` image when there is one;
 * otherwise draws an on-brand cover: the topic icon large in thin lines on the
 * void, crossed by an orbit, with mono labels. Sized in cqw so it scales.
 */
export function InsightCover({ a, index }: { a: Insight; index?: number }) {
  const topic = topicById(a.topic)!
  if (a.cover) {
    return (
      <div className="icover icover--image">
        <img src={a.cover} alt={a.coverAlt ?? ''} loading="lazy" decoding="async" />
      </div>
    )
  }
  return (
    <div className={`icover icover--${a.topic}`} aria-hidden="true">
      <svg className="icover__orbit" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="260" cy="125" rx="190" ry="58" transform="rotate(-12 260 125)" />
        <ellipse cx="260" cy="125" rx="120" ry="36" transform="rotate(-12 260 125)" />
        <circle cx="430" cy="90" r="4" className="icover__moon" />
      </svg>
      <TopicIcon topic={a.topic} className="icover__icon" />
      <span className="icover__label icover__label--tl">({topic.short})</span>
      {index !== undefined && <span className="icover__label icover__label--tr">No. {String(index).padStart(2, '0')}</span>}
      <span className="icover__label icover__label--bl">{a.minutes} min read</span>
    </div>
  )
}
