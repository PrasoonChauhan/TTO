import type { MouseEvent } from 'react'

/** Which button opened the form. Shown in the form title and saved with the lead. */
export type LeadSource = 'intro' | 'start' | 'talk' | 'discovery' | string

const EVENT = 'tto:lead-form'

/** Opens the lead form from anywhere. The form itself is mounted once per page by SiteFooter. */
export function openLeadForm(source: LeadSource) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { source } }))
}

export function onLeadFormOpen(cb: (source: LeadSource) => void) {
  const handler = (e: Event) => cb((e as CustomEvent).detail.source)
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}

/** Props for any link that should open the form. `#start` also works as a shareable deep link. */
export const leadFormLink = (source: LeadSource) => ({
  href: `#start-${source}`,
  onClick: (e: MouseEvent) => {
    e.preventDefault()
    openLeadForm(source)
  },
})
