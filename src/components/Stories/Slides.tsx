import type { CSSProperties, ReactNode } from 'react'
import { brandList } from '../Brands/logos'
import { slideCaption, type Slide, type Work } from '../../content/work'

/**
 * Story slides. Each entry in a story's `slides` list renders one slide:
 * built-in designs (drawn in HTML/CSS, sized in cqw so they stay crisp) or
 * `image` for an uploaded slide. Order and count come from the Markdown file.
 */

/** Story logo: uploaded image if given, else the placeholder mark for the brand. */
function Mark({ w }: { w: Work }): ReactNode {
  if (w.logo) return <img className="slide__logo-img" src={w.logo} alt="" />
  return brandList.find((b) => b.name === w.brand)?.mark ?? <span className="slide__logo-text">{w.brand}</span>
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
      <span className="slide__meta slide__meta--tl">(The gap)</span>
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
      <span className="slide__meta slide__meta--tl">(Identity)</span>
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

function WebsiteSlide({ w, s }: { w: Work; s: Extract<Slide, { type: 'website' }> }) {
  const domain = s.domain ?? `${w.brand.split(' ')[0].toLowerCase()}.com`
  return (
    <div className="slide slide--web">
      <span className="slide__meta slide__meta--tl">(Website)</span>
      <div className="slide__browser">
        <div className="slide__chrome">
          <i />
          <i />
          <i />
          <span className="slide__url">{domain}</span>
        </div>
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
      <span className="slide__meta slide__meta--tl">(Results)</span>
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
