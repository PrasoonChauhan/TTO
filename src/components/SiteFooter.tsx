import { Outro } from './Outro/Outro'
import { Footer } from './Footer/Footer'

/**
 * SITE RULE: every page ends with this. The footer is two parts:
 * the "Final approach" statement (section 10) followed by the footer proper.
 * Pages render <SiteFooter /> after </main> and never use <Footer /> alone.
 */
export function SiteFooter() {
  return (
    <>
      <Outro />
      <Footer />
    </>
  )
}
