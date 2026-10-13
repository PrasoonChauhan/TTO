import type { ReactElement } from 'react'

/**
 * Client marks for "Brands we've helped". Each is a monochrome trace of the
 * client's logo in public/logos/brands/, drawn in currentColor so it takes the
 * section's ink. `scale` balances optical weight: compact symbols render
 * larger than wide wordmarks.
 */
export type Brand = { name: string; caption: string; scale: number; mark: ReactElement }

/** A client mark from public/logos/brands/<slug>.svg; `viewBox` is that file's. */
const mark = (slug: string, viewBox: string) => (
  <svg viewBox={viewBox} fill="currentColor">
    <use href={`/logos/brands/${slug}.svg#mark`} />
  </svg>
)

export const brandList: Brand[] = [
  { name: 'Snap India Trip', caption: 'Snap India Trip', scale: 0.53, mark: mark('snap-india-trip', '10.5 30.7 2592.5 538.3') },
  { name: 'Outrive Trails', caption: 'Outrive Trails', scale: 0.62, mark: mark('outrive-trails', '12.1 16.6 1943.4 569.2') },
  { name: 'Extra Wealth', caption: 'Extra Wealth', scale: 0.53, mark: mark('extra-wealth', '32.2 32.1 2630.1 535.9') },
  { name: 'Brew Lab', caption: 'Brew Lab', scale: 1, mark: mark('brewlab', '10 9.3 581 581.7') },
  { name: 'Anoha', caption: 'Anoha', scale: 0.9, mark: mark('anoha', '9 8.6 783 582.6') },
  { name: 'Zoku Zest', caption: 'Zoku Zest', scale: 0.65, mark: mark('zoku-zest', '-0.4 0 1810.4 602.7') },
  { name: 'Mithila Shri', caption: 'Mithila Shri', scale: 0.72, mark: mark('mithila-shri', '19.2 18 1513.8 578') },
  { name: 'Outcome Outing', caption: 'Outcome Outing', scale: 0.72, mark: mark('outcome-outing', '18.4 17.4 1358.6 567.3') },
]

/** Clients with a mark (e.g. for their review) who are not in the "Brands we've helped" grid. */
const otherMarks: Record<string, ReactElement> = {
  'Shyphan Ai Solutions': mark('shyphan-ai-solutions', '28.4 28.1 2187.4 543.7'),
}

/** The mark for a brand name, if we have one. */
export const markFor = (name: string) =>
  brandList.find((b) => b.name === name)?.mark ?? otherMarks[name]
