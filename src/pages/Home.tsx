import { Nav } from '../components/Nav/Nav'
import { Hero } from '../components/Hero/Hero'
import { Brands } from '../components/Brands/Brands'
import { Gap } from '../components/Gap/Gap'
import { Close } from '../components/Close/Close'
import { Stories } from '../components/Stories/Stories'
import { Reviews } from '../components/Reviews/Reviews'
import { Help } from '../components/Help/Help'
import { Process } from '../components/Process/Process'
import { Faq } from '../components/Faq/Faq'
import { SiteFooter } from '../components/SiteFooter'

export default function Home() {
  return (
    <>
      <Nav />
      <div className="grain" aria-hidden="true" />
      <main>
        <Hero />
        <Brands />
        <Gap />
        <Close />
        <Stories />
        <Reviews />
        <Help />
        <Process />
        <Faq />
      </main>
      <SiteFooter />
    </>
  )
}
