import type { CSSProperties, ReactNode } from 'react'
import { markFor } from '../Brands/logos'
import { slideCaption, type Slide, type Work } from '../../content/work'

/**
 * Story slides. Each entry in a story's `slides` list renders one slide:
 * built-in designs (drawn in HTML/CSS, sized in cqw so they stay crisp) or
 * `image` for an uploaded slide. Order and count come from the Markdown file.
 */

/** Story logo: uploaded image if given, else the mark for the brand. */
function Mark({ w }: { w: Work }): ReactNode {
  if (w.logo) return <img className="slide__logo-img" src={w.logo} alt="" />
  return markFor(w.brand) ?? <span className="slide__logo-text">{w.brand}</span>
}

function Cover({ w }: { w: Work }) {
  return (
    <div className="slide slide--cover">
      <span className="slide__meta slide__meta--tl">Case study</span>
      <span className="slide__meta slide__meta--tr">{w.sector}</span>
      <span className="slide__orb" aria-hidden="true" />
      <div className="slide__cover-mark">
        <Mark w={w} />
      </div>
      <p className="slide__cover-name">{w.brand}</p>
      <ul className="slide__meta slide__meta--bl slide__services">
        {w.services.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  )
}

function GapSlide({ w, s }: { w: Work; s: Extract<Slide, { type: 'gap' }> }) {
  return (
    <div className="slide slide--gap">
      <span className="slide__meta slide__meta--tr">
        {w.gap.key}: <s>{w.gap.from}</s>
      </span>
      <div className="slide__gap-body">
        <p className="slide__title">{s.title}</p>
        <p className="slide__text">{s.body}</p>
      </div>
    </div>
  )
}

function IdentitySlide({ w, s }: { w: Work; s: Extract<Slide, { type: 'identity' }> }) {
  return (
    <div className="slide slide--identity">
      <div className="slide__id-mark">
        <Mark w={w} />
      </div>
      <div className="slide__id-type">
        <span className="slide__id-aa">Aa</span>
        <p className="slide__id-line">{s.line}</p>
      </div>
      <div className="slide__swatches">
        {s.colors.map((c) => (
          <div className="slide__swatch" key={c} style={{ background: c } as CSSProperties}>
            <span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Chrome({ domain }: { domain: string }) {
  return (
    <div className="slide__chrome">
      <i />
      <i />
      <i />
      <span className="slide__url">{domain}</span>
    </div>
  )
}

function WebsiteSlide({ w, s }: { w: Work; s: Extract<Slide, { type: 'website' }> }) {
  const domain = s.domain ?? `${w.brand.split(' ')[0].toLowerCase()}.com`
  if (s.image) {
    return (
      <div className="slide slide--web slide--web-shot">
        {s.title && <p className="slide__web-title">{s.title}</p>}
        <div className="slide__browser">
          <Chrome domain={domain} />
          <img className="slide__shot" src={s.image} alt={s.alt ?? ''} loading="lazy" decoding="async" />
        </div>
      </div>
    )
  }
  return (
    <div className="slide slide--web">
      <div className="slide__browser">
        <Chrome domain={domain} />
        <div className="slide__page">
          <div className="slide__page-nav">
            <span className="slide__page-logo">
              <Mark w={w} />
            </span>
            <span className="slide__page-links">
              <b />
              <b />
              <b />
            </span>
            <span className="slide__page-btn">{s.cta}</span>
          </div>
          <div className="slide__page-hero">
            <p className="slide__page-h1">{s.headline}</p>
            <span className="slide__page-cta">{s.cta}</span>
          </div>
          <div className="slide__page-ui">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultsSlide({ w, s }: { w: Work; s: Extract<Slide, { type: 'results' }> }) {
  return (
    <div className="slide slide--results">
      <span className="slide__meta slide__meta--tr">
        {w.gap.key}: {w.gap.from} → {w.gap.to}
      </span>
      <div className="slide__results">
        {s.items.map((r) => (
          <div className="slide__result" key={r.label}>
            <span className="slide__result-value">{r.value}</span>
            <span className="slide__result-label">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SplitSlide({ s }: { s: Extract<Slide, { type: 'split' }> }) {
  return (
    <div className={`slide slide--split slide--split-${s.side ?? 'right'}`}>
      <div className="slide__split-media">
        <img src={s.image} alt={s.alt ?? ''} loading="lazy" decoding="async" />
      </div>
      <div className="slide__split-body">
        <p className="slide__title slide__title--sm">{s.title}</p>
        {s.body && <p className="slide__text">{s.body}</p>}
      </div>
    </div>
  )
}

/** Tallest a gallery image may be, in cqw. Fewer or narrower images make a shorter row, not taller images. */
const GALLERY_MAX_H = 28

function GallerySlide({ s }: { s: Extract<Slide, { type: 'gallery' }> }) {
  const ratio = s.ratio ?? '4 / 5'
  const [a, b = 1] = ratio.split('/').map(Number)
  const n = s.images.length
  const width = Math.min(90, n * GALLERY_MAX_H * (a / b) + (n - 1) * 1.2)
  const vars = { '--cols': n, '--ratio': ratio, '--w': `${width}cqw` } as CSSProperties
  return (
    <div className="slide slide--gallery">
      <div className="slide__gallery-head">
        <p className="slide__title slide__title--sm">{s.title}</p>
        {s.body && <p className="slide__text">{s.body}</p>}
      </div>
      {s.stat && (
        <div className="slide__stat">
          <span className="slide__stat-value">{s.stat.value}</span>
          <span className="slide__stat-label">{s.stat.label}</span>
        </div>
      )}
      <div className="slide__gallery" style={vars}>
        {s.images.map((im) => (
          <img key={im.src} src={im.src} alt={im.alt ?? ''} loading="lazy" decoding="async" />
        ))}
      </div>
    </div>
  )
}

function FlowSlide({ s }: { s: Extract<Slide, { type: 'flow' }> }) {
  return (
    <div className="slide slide--flow">
      <div className="slide__flow-head">
        <p className="slide__title">{s.title}</p>
        {s.body && <p className="slide__text">{s.body}</p>}
      </div>
      <ol className="slide__flow" style={{ '--n': s.steps.length } as CSSProperties}>
        {s.steps.map((t, i) => (
          <li className={i + 1 === s.highlight ? 'is-on' : undefined} key={t}>
            <span className="slide__flow-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="slide__flow-dot" aria-hidden="true" />
            <span className="slide__flow-label">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ImageSlide({ s }: { s: Extract<Slide, { type: 'image' }> }) {
  return (
    <div className={`slide slide--image slide--image-${s.fit ?? 'cover'}`}>
      <img src={s.src} alt={s.alt ?? ''} loading="lazy" decoding="async" />
    </div>
  )
}

function render(w: Work, s: Slide) {
  switch (s.type) {
    case 'cover':
      return <Cover w={w} />
    case 'gap':
      return <GapSlide w={w} s={s} />
    case 'identity':
      return <IdentitySlide w={w} s={s} />
    case 'website':
      return <WebsiteSlide w={w} s={s} />
    case 'results':
      return <ResultsSlide w={w} s={s} />
    case 'image':
      return <ImageSlide s={s} />
    case 'split':
      return <SplitSlide s={s} />
    case 'gallery':
      return <GallerySlide s={s} />
    case 'flow':
      return <FlowSlide s={s} />
  }
}

export function Slides({ story }: { story: Work }) {
  const { bg, ink, accent, soft } = story.palette
  const vars = { '--sl-bg': bg, '--sl-ink': ink, '--sl-accent': accent, '--sl-soft': soft } as CSSProperties
  return (
    <>
      {story.slides.map((s, i) => (
        <div className="deck__slide" style={vars} data-title={slideCaption(s)} key={i} aria-hidden={i !== 0}>
          {render(story, s)}
        </div>
      ))}
    </>
  )
}
