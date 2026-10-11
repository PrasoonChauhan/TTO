import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE } from '../lib/gsap'
import { useSectionTheme } from '../hooks/useSectionTheme'
import { Nav } from '../components/Nav/Nav'
import { SplitLines } from '../components/ui/SplitLines'
import { SiteFooter } from '../components/SiteFooter'
import { TopicIcon } from '../components/Insights/TopicIcon'
import { InsightCard } from '../components/Insights/InsightCard'
import { allInsights, leadOf, topicById, topicCount, TOPICS } from '../content/insights'
import type { TopicId } from '../content/topics'
import { insightsCopy } from '../content/copy'
import '../components/Insights/Insights.css'

type Filter = TopicId | 'all'
const readFilter = (): Filter => {
  const t = new URLSearchParams(window.location.search).get('topic')
  return t && topicById(t) ? (t as TopicId) : 'all'
}
const pad = (n: number) => String(n).padStart(2, '0')
/** Issue number: oldest article is No. 01. */
const issueOf = (slug: string) => allInsights.length - allInsights.findIndex((a) => a.slug === slug)

function Header() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, 'light')
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.set(q('.fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.line-inner'), { yPercent: 140 })
      gsap
        .timeline({ delay: 0.2 })
        .to(q('.line-inner'), { yPercent: 0, duration: 1.3, stagger: 0.1, ease: EASE.reveal }, 0)
        .to(q('.fade-up'), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: EASE.move }, 0.4)
    },
    { scope: root },
  )
  const h = insightsCopy.hero
  return (
    <header className="ins-hero" id="top" ref={root} data-nav-glass>
      <p className="eyebrow ins-hero__eyebrow fade-up">{h.eyebrow}</p>
      <SplitLines as="h1" lines={h.title} className="display ins-hero__title" />
      <div className="ins-hero__foot">
        <p className="ins-hero__sub fade-up">{h.sub}</p>
        <p className="eyebrow ins-hero__count fade-up">
          {pad(allInsights.length)} notes · {TOPICS.length} topics
        </p>
      </div>
    </header>
  )
}

function Listing() {
  const root = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<Filter>(readFilter)
  useSectionTheme(root, 'light')

  // Keep the URL shareable (?topic=marketing) and honour back/forward.
  useEffect(() => {
    const onPop = () => setFilter(readFilter())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const choose = (f: Filter) => {
    if (f === filter) return
    const url = new URL(window.location.href)
    if (f === 'all') url.searchParams.delete('topic')
    else url.searchParams.set('topic', f)
    history.pushState(null, '', url)
    setFilter(f)
  }

  const list = filter === 'all' ? allInsights : allInsights.filter((a) => a.topic === filter)
  const lead = leadOf(list)
  const rest = list.filter((a) => a !== lead)
  const topic = filter === 'all' ? null : topicById(filter)!

  // Cards arrive with a short stagger whenever the filter changes.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.fromTo(
        q('.icard, .ins-empty, .ins-topic'),
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06, ease: EASE.reveal, onComplete: () => ScrollTrigger.refresh() },
      )
    },
    { scope: root, dependencies: [filter] },
  )

  return (
    <section className="ins-list" id="notes" ref={root} data-nav-glass aria-label="Articles">
      <nav className="ins-filter" aria-label="Filter by topic">
        <ul className="ins-filter__list">
          {(['all', ...TOPICS.map((t) => t.id)] as Filter[]).map((id) => {
            const count = id === 'all' ? allInsights.length : topicCount(id)
            const label = id === 'all' ? 'All notes' : topicById(id)!.label
            return (
              <li key={id}>
                <button
                  type="button"
                  className={`ins-chip${filter === id ? ' is-on' : ''}${count === 0 ? ' is-empty' : ''}`}
                  aria-pressed={filter === id}
                  onClick={() => choose(id)}
                >
                  <TopicIcon topic={id} />
                  <span>{label}</span>
                  <sup className="ins-chip__count">{pad(count)}</sup>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {topic && (
        <p className="ins-topic">
          <TopicIcon topic={topic.id} />
          <span>
            <strong>{topic.label}.</strong> {topic.description}
          </span>
        </p>
      )}

      {lead ? (
        <>
          <div className="ins-lead">
            <InsightCard a={lead} lead issue={issueOf(lead.slug)} />
          </div>
          {rest.length > 0 && (
            <div className="ins-grid">
              {rest.map((a) => (
                <InsightCard a={a} key={a.slug} issue={issueOf(a.slug)} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="ins-empty">
          <p className="display ins-empty__title">Notes on {topic?.label} are on their way.</p>
          <button type="button" className="ins-empty__back" onClick={() => choose('all')}>
            See all notes
          </button>
        </div>
      )}
    </section>
  )
}

export default function Insights() {
  return (
    <>
      <Nav />
      <div className="grain" aria-hidden="true" />
      <main>
        <Header />
        <Listing />
      </main>
      <SiteFooter />
    </>
  )
}
