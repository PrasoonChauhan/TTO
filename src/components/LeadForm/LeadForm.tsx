import { useEffect, useRef, useState, type FormEvent } from 'react'
import { gsap, EASE } from '../../lib/gsap'
import { getLenis } from '../../lib/smoothScroll'
import { onLeadFormOpen, type LeadSource } from '../../lib/leadForm'
import { useRoll } from '../../hooks/useRoll'
import { Arrow } from '../ui/Arrow'
import { CONTACT_EMAIL, LEAD_FORM_ENDPOINT, leadForm as copy, whatsappHref } from '../../content/copy'
import './LeadForm.css'

type Fields = { name: string; company: string; website: string; phone: string; time: string }
type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'manual'

const EMPTY: Fields = { name: '', company: '', website: '', phone: '', time: '' }
const TIMEOUT_MS = 15000
/** Bots submit instantly; people take longer than this. */
const MIN_FILL_MS = 2500

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (f.name.trim().length < 2) e.name = 'Please add your name.'
  if (f.company.trim().length < 2) e.company = 'Please add your company or business name.'
  if (f.phone.replace(/\D/g, '').length < 8) e.phone = 'Please add a phone number with country code.'
  return e
}

/** Plain-text summary used by the WhatsApp and email fallbacks. */
function summary(f: Fields, title: string) {
  return [
    `Hi The Third Orbit, I would like to ${title.toLowerCase()}.`,
    '',
    `Name: ${f.name.trim()}`,
    `Company: ${f.company.trim()}`,
    f.website.trim() && `Website: ${f.website.trim()}`,
    `Phone: ${f.phone.trim()}`,
    f.time && `Best time to call: ${f.time} (IST)`,
  ]
    .filter((l): l is string => typeof l === 'string' && l !== '')
    .join('\n')
}

/** POST to the Apps Script web app. A simple form-encoded request, so no CORS preflight. */
async function submit(payload: Record<string, string>) {
  if (!LEAD_FORM_ENDPOINT) return false
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(LEAD_FORM_ENDPOINT, { method: 'POST', body: new URLSearchParams(payload), signal: ctrl.signal })
    const json = await res.json().catch(() => null)
    return res.ok && json?.ok === true
  } catch {
    return false
  } finally {
    window.clearTimeout(timer)
  }
}

/**
 * Lead form. Mounted once per page (inside SiteFooter) and opened from any
 * button via openLeadForm(source). It never dead-ends: if sending fails, the
 * visitor can send the same details by WhatsApp or email in one tap.
 */
export function LeadForm() {
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const scrim = useRef<HTMLDivElement>(null)
  const openedAt = useRef(0)
  const closing = useRef(false)
  const [source, setSource] = useState<LeadSource>('start')
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [trap, setTrap] = useState('')
  const roll = useRoll<HTMLSpanElement, HTMLSpanElement>()
  const title = copy.titles[source] ?? copy.titles.start

  const open = (src: LeadSource) => {
    const d = dialog.current
    if (!d) return
    setSource(src)
    if (status !== 'idle') setStatus('idle')
    if (d.open) return
    d.showModal()
    getLenis()?.stop()
    closing.current = false
    openedAt.current = Date.now()
    gsap.fromTo(scrim.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: EASE.move })
    gsap.fromTo(panel.current, { xPercent: 100 }, { xPercent: 0, duration: 0.8, ease: 'power4.out' })
    gsap.fromTo(
      panel.current!.querySelectorAll('.lead__reveal'),
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, ease: EASE.move, delay: 0.2 },
    )
    window.setTimeout(() => panel.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus(), 450)
  }

  const close = () => {
    const d = dialog.current
    if (!d || closing.current || !d.open) return
    closing.current = true
    gsap.to(panel.current, { xPercent: 100, duration: 0.5, ease: 'power3.in' })
    gsap.to(scrim.current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        d.close()
        getLenis()?.start()
        if (location.hash.startsWith('#start')) history.replaceState(null, '', location.pathname + location.search)
        if (status === 'sent') {
          setFields(EMPTY)
          setStatus('idle')
        }
      },
    })
  }

  // Opened by buttons, or by a #start / #start-<source> link.
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#start(?:-([a-z]+))?$/)
      if (m) open(m[1] ?? 'start')
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    const off = onLeadFormOpen(open)
    return () => {
      off()
      window.removeEventListener('hashchange', fromHash)
    }
  })

  // Escape animates out instead of the abrupt native close.
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      close()
    }
    d.addEventListener('cancel', onCancel)
    return () => d.removeEventListener('cancel', onCancel)
  })

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(fields)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      panel.current?.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus()
      return
    }
    // Spam: a filled hidden field or an instant submit gets a quiet "success" and is dropped.
    if (trap || Date.now() - openedAt.current < MIN_FILL_MS) {
      setStatus('sent')
      return
    }
    // Not connected yet (no endpoint): go straight to the one-tap WhatsApp or email hand-off.
    if (!LEAD_FORM_ENDPOINT) {
      setStatus('manual')
      return
    }
    setStatus('sending')
    const ok = await submit({
      name: fields.name.trim(),
      company: fields.company.trim(),
      website: fields.website.trim(),
      phone: fields.phone.trim(),
      time: fields.time,
      source: title,
      page: location.pathname,
    })
    setStatus(ok ? 'sent' : 'failed')
  }

  const firstName = fields.name.trim().split(/\s+/)[0] || 'there'
  const when = fields.time && fields.time !== 'Anytime' ? `in the ${fields.time.split(',')[0].toLowerCase()} (IST)` : 'shortly'
  const text = summary(fields, title)

  return (
    <dialog className="lead" ref={dialog} aria-labelledby="lead-title">
      <div className="lead__scrim" ref={scrim} onClick={close} />
      <div className="lead__panel" ref={panel} data-lenis-prevent>
        <div className="lead__bar lead__reveal">
          <p className="eyebrow lead__eyebrow">
            <span className="lead__dot" aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <button type="button" className="eyebrow lead__close" onClick={close}>
            Close
          </button>
        </div>

        {status === 'sent' ? (
          <div className="lead__done" role="status">
            <p className="display lead__title">{copy.success.title}</p>
            <p className="lead__sub">{copy.success.body.replace('{name}', firstName).replace('{when}', when)}</p>
            <div className="lead__actions">
              <a className="lead__link" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
                {copy.success.whatsapp} ↗
              </a>
              <button type="button" className="lead__link" onClick={close}>
                {copy.success.close}
              </button>
            </div>
          </div>
        ) : status === 'failed' || status === 'manual' ? (
          <div className="lead__done" role="alert">
            <p className="display lead__title">{status === 'manual' ? copy.manual.title : copy.error.title}</p>
            <p className="lead__sub">{status === 'manual' ? copy.manual.body : copy.error.body}</p>
            <pre className="lead__summary">{text}</pre>
            <div className="lead__fallbacks">
              <a className="mbtn mbtn--lg lead__fallback" href={whatsappHref(text)} target="_blank" rel="noopener noreferrer">
                {copy.error.whatsapp} ↗
              </a>
              <a
                className="lead__link"
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${title}: ${fields.name.trim()} (${fields.company.trim()})`)}&body=${encodeURIComponent(text)}`}
              >
                {copy.error.email}
              </a>
              {status === 'failed' && (
                <button type="button" className="lead__link" onClick={() => setStatus('idle')}>
                {copy.error.retry}
              </button>
              )}
            </div>
          </div>
        ) : (
          <form className="lead__form" onSubmit={onSubmit} noValidate>
            <h2 className="display lead__title lead__reveal" id="lead-title">
              {title}
            </h2>
            <p className="lead__sub lead__reveal">{copy.sub}</p>

            <Field k="name" required value={fields.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            <Field k="company" required value={fields.company} onChange={set('company')} error={errors.company} autoComplete="organization" />
            <Field k="website" value={fields.website} onChange={set('website')} type="url" inputMode="url" autoComplete="url" />
            <Field k="phone" required value={fields.phone} onChange={set('phone')} error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" />

            <fieldset className="lead__field lead__reveal">
              <legend className="lead__label">
                {copy.fields.time.label} <span className="lead__hint">{copy.fields.time.hint}</span>
              </legend>
              <div className="lead__times">
                {copy.times.map((t) => (
                  <label key={t} className={`lead__time${fields.time === t ? ' is-on' : ''}`}>
                    <input
                      type="radio"
                      name="time"
                      value={t}
                      checked={fields.time === t}
                      onChange={() => set('time')(t)}
                      onClick={() => fields.time === t && set('time')('')}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Honeypot: invisible to people, irresistible to bots. */}
            <label className="lead__trap" aria-hidden="true">
              Fax
              <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} name="fax" />
            </label>

            <div className="lead__submit-row lead__reveal">
              <button
                type="submit"
                className="mbtn mbtn--lg lead__submit"
                disabled={status === 'sending'}
                onMouseEnter={roll.enter}
                onMouseLeave={roll.leave}
                onFocus={roll.enter}
                onBlur={roll.leave}
              >
                <span className="mbtn__label">
                  <span className="mbtn__roll" ref={roll.roll}>
                    <span className="mbtn__text">{status === 'sending' ? copy.sending : copy.submit}</span>
                    <span className="mbtn__text mbtn__text--twin">{status === 'sending' ? copy.sending : copy.submit}</span>
                  </span>
                </span>
                <span className="mbtn__tile" aria-hidden="true">
                  <span className="mbtn__arrows" ref={roll.arrows}>
                    <span className="mbtn__arrow">
                      <Arrow />
                    </span>
                    <span className="mbtn__arrow mbtn__arrow--twin">
                      <Arrow />
                    </span>
                  </span>
                </span>
              </button>
              <p className="lead__privacy">
                {copy.privacy}{' '}
                <a href={copy.privacyLink.href} target="_blank" rel="noopener">
                  {copy.privacyLink.label}
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}

type FieldProps = {
  k: 'name' | 'company' | 'website' | 'phone'
  value: string
  onChange: (v: string) => void
  required?: boolean
  error?: string
  type?: string
  inputMode?: 'url' | 'tel' | 'text'
  autoComplete?: string
}

function Field({ k, value, onChange, required, error, type = 'text', inputMode, autoComplete }: FieldProps) {
  const f = copy.fields[k] as { label: string; placeholder: string; hint?: string }
  const id = `lead-${k}`
  return (
    <div className={`lead__field lead__reveal${error ? ' has-error' : ''}`}>
      <label className="lead__label" htmlFor={id}>
        {f.label}
        {required ? <span className="lead__req" aria-hidden="true"> *</span> : <span className="lead__hint"> {f.hint}</span>}
      </label>
      <input
        id={id}
        name={k}
        className="lead__input"
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={f.placeholder}
        value={value}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : required && f.hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {required && f.hint && !error && (
        <p className="lead__note" id={`${id}-hint`}>
          {f.hint}
        </p>
      )}
      {error && (
        <p className="lead__error" id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  )
}
