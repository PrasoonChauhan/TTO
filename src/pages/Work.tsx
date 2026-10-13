import { useRef } from 'react'
import { gsap, useGSAP, EASE } from '../lib/gsap'
import { useSectionTheme } from '../hooks/useSectionTheme'
import { Nav } from '../components/Nav/Nav'
import { SplitLines } from '../components/ui/SplitLines'
import { Stories } from '../components/Stories/Stories'
import { SiteFooter } from '../components/SiteFooter'
import { allWork, featuredWork } from '../content/work'
import { storiesCopy } from '../content/copy'
import './Work.css'

/** /work/?edit shows file names, home status and edit links on every story. */
const editMode = new URLSearchParams(window.location.search).has('edit')

function WorkHero() {
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
  const h = storiesCopy.pageHero
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <header className="work-hero" id="top" ref={root} data-nav-glass>
      <p className="eyebrow work-hero__eyebrow fade-up">{h.eyebrow}</p>
      <SplitLines as="h1" lines={h.title} className="display work-hero__title" />
      <div className="work-hero__foot">
        <p className="work-hero__sub fade-up">{h.sub}</p>
        <p className="eyebrow work-hero__count fade-up">
          {pad(allWork.length)} featured stories
        </p>
      </div>
      {editMode && (
        <p className="eyebrow work-hero__edit fade-up">
          Edit mode · {featuredWork.length}/4 featured on home · files live in content/work/
        </p>
      )}
    </header>
  )
}

export default function Work() {
  return (
    <>
      <Nav />
      <div className="grain" aria-hidden="true" />
      <main>
        <WorkHero />
        <Stories items={allWork} variant="page" editMode={editMode} />
      </main>
      <SiteFooter />
    </>
  )
}
