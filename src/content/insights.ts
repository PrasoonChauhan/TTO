import { articles, authors as rawAuthors } from 'virtual:insights'
import bodies from 'virtual:insight-bodies'
import { TOPICS, topicById, type TopicId } from './topics'

/**
 * Insights (articles). Source of truth: one Markdown file per article in
 * content/insights/. Field guide: content/insights/README.md.
 */

export type Author = { name: string; role?: string; photo?: string; bio?: string; linkedin?: string }
export type Heading = { id: string; text: string; level: number }
export type Insight = {
  file: string
  slug: string
  title: string
  excerpt: string
  topic: TopicId
  date: string
  updated?: string
  author: string
  tags: string[]
  cover?: string
  coverAlt?: string
  featured: boolean
  takeaways: string[]
  minutes: number
  words: number
  toc: Heading[]
}

/** Newest first. */
export const allInsights = articles as Insight[]
export const authors = rawAuthors as Record<string, Author>
export const loadBody = (slug: string) => bodies[slug]?.().then((m) => m.default.html)

export { TOPICS, topicById }
export const topicCount = (id: TopicId) => allInsights.filter((a) => a.topic === id).length

/** The lead story: an article pinned with `featured: true`, otherwise the newest. */
export const leadOf = (list: Insight[]) => list.find((a) => a.featured) ?? list[0]

export const insightHref = (a: Pick<Insight, 'slug'>) => `/insights/${a.slug}/`
export const topicHref = (id: TopicId) => `/insights/?topic=${id}`

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/** Same topic first, then the newest others. */
export function related(a: Insight, n = 3) {
  const others = allInsights.filter((x) => x.slug !== a.slug)
  return [...others.filter((x) => x.topic === a.topic), ...others.filter((x) => x.topic !== a.topic)].slice(0, n)
}
