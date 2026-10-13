import all from 'virtual:work'

/**
 * Work (success stories). Source of truth: one Markdown file per story in
 * content/work/. See content/work/README.md for every field.
 *
 *   allWork       every story, sorted by `order`  -> /work/
 *   featuredWork  `featured: true`, first 4       -> home "Success stories"
 */

export type Palette = { bg: string; ink: string; accent: string; soft: string }
export type Metric = { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }

export type SlideImage = { src: string; alt?: string }

/** Built-in slide designs (drawn in code) plus `image` for uploaded slides. */
export type Slide =
  | { type: 'cover'; caption?: string }
  | { type: 'gap'; caption?: string; title: string; body: string }
  | { type: 'identity'; caption?: string; line: string; colors: string[] }
  /** Drawn page from `headline` and `cta`, or a real screenshot via `image` (with an optional `title` above it). */
  | { type: 'website'; caption?: string; headline?: string; cta?: string; domain?: string; image?: string; alt?: string; title?: string }
  | { type: 'results'; caption?: string; items: { value: string; label: string }[] }
  | { type: 'image'; caption?: string; src: string; alt?: string; fit?: 'cover' | 'contain' }
  /** Half photo, half story. */
  | { type: 'split'; caption?: string; title: string; body?: string; image: string; alt?: string; side?: 'left' | 'right' }
  /** A row of images under a title, with an optional headline number. */
  | { type: 'gallery'; caption?: string; title: string; body?: string; images: SlideImage[]; ratio?: string; stat?: { value: string; label: string } }
  /** Numbered steps on a line; `highlight` (1-based) marks the step that is ours. */
  | { type: 'flow'; caption?: string; title: string; body?: string; steps: string[]; highlight?: number }

export type Work = {
  file: string
  slug: string
  brand: string
  sector: string
  /** Optional logo image (SVG or PNG in /public). Without it, the placeholder mark for `brand` is used. */
  logo?: string
  services: string[]
  gap: { key: string; from: string; to: string }
  metrics: Metric[]
  palette: Palette
  slides: Slide[]
  featured: boolean
  order: number
  summary: string
}

const DEFAULT_CAPTION: Record<Slide['type'], string> = {
  cover: 'Cover',
  gap: 'The gap',
  identity: 'Identity',
  website: 'Website',
  results: 'Results',
  image: 'Slide',
  split: 'Story',
  gallery: 'Gallery',
  flow: 'Process',
}
export const slideCaption = (s: Slide) => s.caption ?? DEFAULT_CAPTION[s.type]

export const HOME_LIMIT = 4
export const allWork = all as Work[]
export const featuredWork = allWork.filter((w) => w.featured).slice(0, HOME_LIMIT)

export const storyId = (w: Pick<Work, 'slug'>) => `story-${w.slug}`
export const workByBrand = (brand: string) => allWork.find((w) => w.brand === brand)

/** Where a story lives: on home if featured there, otherwise on /work/. */
export function storyHref(w: Work) {
  return featuredWork.includes(w) ? `/#${storyId(w)}` : `/work/#${storyId(w)}`
}

/** Edit link shown in ?edit mode. Points at the file in the GitHub repo. */
export const REPO_EDIT_BASE = 'https://github.com/PrasoonChauhan/TTO/edit/main/content/work/'
