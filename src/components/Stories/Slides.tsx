import type { CSSProperties } from 'react'
import { brandList } from '../Brands/logos'
import type { Story } from './storyData'

/**
 * Dummy presentation slides, rendered in HTML/CSS so they stay crisp at any
 * size. All measurements use container query units (cqw) of the deck frame.
 * Replace with real slide images later: one <img> per slide works the same.
 */

export const SLIDE_TITLES = ['Cover', 'The gap', 'Identity', 'Website', 'Results'] as const

const markFor = (brand: string) => brandList.find((b) => b.name === brand)?.mark

function Cover({ s }: { s: Story }) {
  return (
    <div className="slide slide--cover">
      <span className="slide__meta slide__meta--tl">Case study</span>
      <span className="slide__meta slide__meta--tr">{s.sector}</span>
      <span className="slide__orb" aria-hidden="true" />
      <div className="slide__cover-mark">{markFor(s.brand)}</div>
      <p className="slide__cover-name">{s.brand}</p>
      <ul className="slide__meta slide__meta--bl slide__services">
        {s.services.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  )
}

function GapSlide({ s }: { s: Story }) {
  return (
    <div className="slide slide--gap">
      <span className="slide__meta slide__meta--tl">(The gap)</span>
      <span className="slide__meta slide__meta--tr">
        {s.gapClosed.key}: <s>{s.gapClosed.from}</s>
      </span>
      <div className="slide__gap-body">
        <p className="slide__title">{s.slides.gap.title}</p>
        <p className="slide__text">{s.slides.gap.body}</p>
      </div>
    </div>
  )
}

function IdentitySlide({ s }: { s: Story }) {
  return (
    <div className="slide slide--identity">
      <span className="slide__meta slide__meta--tl">(Identity)</span>
      <div className="slide__id-mark">{markFor(s.brand)}</div>
      <div className="slide__id-type">
        <span className="slide__id-aa">Aa</span>
        <p className="slide__id-line">{s.slides.identity.line}</p>
      </div>
      <div className="slide__swatches">
        {s.slides.identity.colors.map((c) => (
          <div className="slide__swatch" key={c} style={{ background: c } as CSSProperties}>
            <span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WebsiteSlide({ s }: { s: Story }) {
  const domain = `${s.brand.split(' ')[0].toLowerCase()}.com`
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
            <span className="slide__page-logo">{markFor(s.brand)}</span>
            <span className="slide__page-links">
              <b />
              <b />
              <b />
            </span>
            <span className="slide__page-btn">{s.slides.website.cta}</span>
          </div>
          <div className="slide__page-hero">
            <p className="slide__page-h1">{s.slides.website.headline}</p>
            <span className="slide__page-cta">{s.slides.website.cta}</span>
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

function ResultsSlide({ s }: { s: Story }) {
  return (
    <div className="slide slide--results">
      <span className="slide__meta slide__meta--tl">(Results)</span>
      <span className="slide__meta slide__meta--tr">
        {s.gapClosed.key}: {s.gapClosed.from} → {s.gapClosed.to}
      </span>
      <div className="slide__results">
        {s.slides.results.map((r) => (
          <div className="slide__result" key={r.label}>
            <span className="slide__result-value">{r.value}</span>
            <span className="slide__result-label">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Slides({ story }: { story: Story }) {
  const { bg, ink, accent, soft } = story.palette
  const vars = { '--sl-bg': bg, '--sl-ink': ink, '--sl-accent': accent, '--sl-soft': soft } as CSSProperties
  const slides = [Cover, GapSlide, IdentitySlide, WebsiteSlide, ResultsSlide]
  return (
    <>
      {slides.map((S, i) => (
        <div className="deck__slide" style={vars} data-title={SLIDE_TITLES[i]} key={i} aria-hidden={i !== 0}>
          <S s={story} />
        </div>
      ))}
    </>
  )
}
