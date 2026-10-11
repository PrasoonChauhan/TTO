import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, EASE } from '../lib/gsap'
import { getLenis } from '../lib/smoothScroll'
import { useSectionTheme } from '../hooks/useSectionTheme'
import { Nav } from '../components/Nav/Nav'
import { SiteFooter } from '../components/SiteFooter'
import { TopicIcon } from '../components/Insights/TopicIcon'
import { InsightCover } from '../components/Insights/InsightCover'
import { InsightCard } from '../components/Insights/InsightCard'
import {
  allInsights,
  authors,
  formatDate,
  loadBody,
  related,
  topicById,
  topicHref,
  insightHref,
  type Insight,
} from '../content/insights'
import { SITE_URL } from '../content/topics'
import '../components/Insights/Insights.css'

/** The generated page tells us which article this is. */
const slug = document.body.dataset.slug ?? window.location.pathname.split('/').filter(Boolean).pop() ?? ''
const article = allInsights.find((a) => a.slug === slug)
const issueOf = (s: string) => allInsights.length - allInsights.findIndex((a) => a.slug === s)

function Share({ a }: { a: Insight }) {
  const [copied, setCopied] = useState(false)
  const url = `${SITE_URL}${insightHref(a)}`
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(a.title)
  const copy = () => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="art-share">
      <p className="eyebrow art-aside__label">Share</p>
      <ul>
        <li><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`} target="_blank" rel="noopener noreferrer">X</a></li>
        <li><a href={`mailto:?subject=${t}&body=${u}`}>Email</a></li>
        <li><button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy link'}</button></li>
      </ul>
    </div>
  )
}

function ArticlePage({ a }: { a: Insight }) {
  const root = useRef<HTMLDivElement>(null)
  const head = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [active, setActive] = useState<string | null>(a.toc[0]?.id ?? null)
  const author = authors[a.author]
  const topic = topicById(a.topic)!
  useSectionTheme(root, 'light')

  useEffect(() => {
    loadBody(a.slug)?.then(setHtml)
  }, [a.slug])

  /* Entrance */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.set(q('.art-head .fade-up'), { autoAlpha: 0, y: 16 })
      gsap.set(q('.art-head .art-title'), { autoAlpha: 0, y: 30 })
      gsap
        .timeline({ delay: 0.15 })
        .to(q('.art-head .art-title'), { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE.reveal }, 0)
        .to(q('.art-head .fade-up'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06, ease: EASE.move }, 0.2)
      gsap.from(q('.art-cover'), { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.4, ease: 'power4.inOut', delay: 0.3 })
      // Reading progress across the article body only.
      gsap.fromTo(
        q('.art-progress__fill'),
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: q('.art-main')[0], start: 'top 30%', end: 'bottom 70%', scrub: true } },
      )
    },
    { scope: root },
  )

  /* Once the body is in: re-measure, honour #heading links, track the active section. */
  useEffect(() => {
    if (!html || !bodyRef.current) return
    ScrollTrigger.refresh()
    const hash = window.location.hash.slice(1)
    if (hash) {
      const el = document.getElementById(hash)
      if (el) getLenis()?.scrollTo(el, { offset: -110, immediate: true, force: true })
    }
    const heads = Array.from(bodyRef.current.querySelectorAll<HTMLElement>('h2[id], h3[id]'))
    const triggers = heads.map((h, i) =>
      ScrollTrigger.create({
        trigger: h,
        start: 'top 35%',
        end: () => (heads[i + 1] ? `top+=${heads[i + 1].offsetTop - h.offsetTop} 35%` : 'bottom top'),
        onToggle: (self) => self.isActive && setActive(h.id),
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [html])

  const jump = (id: string) => (e: React.MouseEvent) => {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    history.replaceState(null, '', `#${id}`)
    getLenis()?.scrollTo(el, { offset: -110, duration: 1.4 })
  }

  return (
    <div className="art" ref={root}>
      <div className="art-progress" aria-hidden="true">
        <span className="art-progress__fill" />
      </div>

      <header className="art-head" id="top" ref={head} data-nav-glass>
        <nav className="eyebrow art-crumbs fade-up" aria-label="Breadcrumb">
          <a href="/insights/">Insights</a>
          <span aria-hidden="true">/</span>
          <a href={topicHref(a.topic)} className="art-crumbs__topic">
            <TopicIcon topic={a.topic} />
            {topic.label}
          </a>
        </nav>
        <h1 className="display art-title">{a.title}</h1>
        <p className="art-excerpt fade-up">{a.excerpt}</p>
        <div className="art-meta fade-up">
          <div className="art-author">
            {author.photo && <img src={author.photo} alt="" width={48} height={48} />}
            <span>
              <span className="art-author__name">{author.name}</span>
              {author.role && <span className="art-author__role">{author.role}</span>}
            </span>
          </div>
          <dl className="art-facts">
            <div>
              <dt className="eyebrow">Published</dt>
              <dd><time dateTime={a.date}>{formatDate(a.date)}</time></dd>
            </div>
            {a.updated && (
              <div>
                <dt className="eyebrow">Updated</dt>
                <dd><time dateTime={a.updated}>{formatDate(a.updated)}</time></dd>
              </div>
            )}
            <div>
              <dt className="eyebrow">Reading time</dt>
              <dd>{a.minutes} min</dd>
            </div>
          </dl>
        </div>
        <div className="art-cover">
          <InsightCover a={a} index={issueOf(a.slug)} />
        </div>
      </header>

      <section className="art-body" data-nav-glass>
        <aside className="art-aside">
          <div className="art-aside__sticky">
            {a.toc.length > 1 && (
              <nav className="art-toc" aria-label="On this page">
                <p className="eyebrow art-aside__label">On this page</p>
                <ol>
                  {a.toc.map((h) => (
                    <li key={h.id} className={`art-toc__item art-toc__item--h${h.level}${active === h.id ? ' is-on' : ''}`}>
                      <a href={`#${h.id}`} onClick={jump(h.id)}>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <Share a={a} />
            <a className="eyebrow art-back" href="/insights/">← All notes</a>
          </div>
        </aside>

        <div className="art-main">
          {a.takeaways.length > 0 && (
            <div className="art-takeaways">
              <p className="eyebrow art-takeaways__label">Key takeaways</p>
              <ul>
                {a.takeaways.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose" ref={bodyRef}>
            {html === null ? <p className="prose__loading">Loading…</p> : <div dangerouslySetInnerHTML={{ __html: html }} />}
          </div>

          {a.tags.length > 0 && (
            <ul className="art-tags" aria-label="Tags">
              {a.tags.map((t) => (
                <li key={t} className="eyebrow">{t}</li>
              ))}
            </ul>
          )}

          <div className="art-bio">
            {author.photo && <img src={author.photo} alt="" width={72} height={72} />}
            <div>
              <p className="eyebrow art-aside__label">Written by</p>
              <p className="art-bio__name">{author.name}</p>
              {author.bio && <p className="art-bio__text">{author.bio}</p>}
              {author.linkedin && (
                <a className="art-bio__link" href={author.linkedin} target="_blank" rel="noopener noreferrer">
                  Follow on LinkedIn ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="art-related" data-nav-glass aria-labelledby="related-title">
        <div className="art-related__head">
          <p className="eyebrow art-aside__label" id="related-title">Keep reading</p>
          <a className="art-related__all" href="/insights/">All notes ↗</a>
        </div>
        <div className="ins-grid">
          {related(a).map((r) => (
            <InsightCard a={r} key={r.slug} issue={issueOf(r.slug)} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default function Article() {
  return (
    <>
      <Nav />
      <div className="grain" aria-hidden="true" />
      <main>
        {article ? (
          <ArticlePage a={article} />
        ) : (
          <section className="art-missing">
            <p className="display">This note has drifted out of orbit.</p>
            <a href="/insights/">Back to all notes</a>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
