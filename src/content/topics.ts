/**
 * Insight topics. Six mirror the six disciplines in "What we can help with",
 * so services and articles reinforce each other for search. "Signals" covers
 * what is moving in the market right now.
 *
 * Plain data only: this file is also read by the build (plugins/insightsContent.ts).
 */
export const TOPICS = [
  {
    id: 'strategy',
    label: 'Growth Strategy',
    short: 'Strategy',
    description: 'Positioning, pricing, go-to-market and the decisions that set your trajectory.',
  },
  {
    id: 'brand',
    label: 'Brand & Identity',
    short: 'Brand',
    description: 'Making your value obvious: story, naming, identity and messaging.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    short: 'Marketing',
    description: 'Demand that compounds: content, SEO, channels and launches.',
  },
  {
    id: 'sales',
    label: 'Sales Funnels',
    short: 'Sales',
    description: 'Pipelines that convert without the founder in every deal.',
  },
  {
    id: 'technology',
    label: 'Technology & AI',
    short: 'Technology',
    description: 'Websites, products, AI and automation built to scale.',
  },
  {
    id: 'operations',
    label: 'Data & Operations',
    short: 'Operations',
    description: 'Metrics, dashboards and systems that run on their own.',
  },
  {
    id: 'signals',
    label: 'Signals',
    short: 'Signals',
    description: 'What is moving in the market right now, and what it means for founders.',
  },
] as const

export type TopicId = (typeof TOPICS)[number]['id']
export const topicById = (id: string) => TOPICS.find((t) => t.id === id)

/** Public site address, used for canonical URLs, social cards and the sitemap. */
export const SITE_URL = 'https://thethirdorbit.co'
