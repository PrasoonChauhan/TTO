import type { ReactElement } from 'react'
import type { TopicId } from '../../content/topics'

/** 1px line icons, one per topic, drawn on a 24px grid in the site's telemetry style. */
const PATHS: Record<TopicId | 'all', ReactElement> = {
  all: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" />
    </>
  ),
  // Trajectory through milestones
  strategy: (
    <>
      <path d="M3.5 19.5C9 19 12.5 14 19.5 5" />
      <path d="M14.5 5h5v5" />
      <circle cx="8" cy="18.2" r="1.3" />
      <circle cx="13" cy="13.6" r="1.3" />
    </>
  ),
  // Mark built on a circle and a slash
  brand: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M5.5 18.5 18.5 5.5" />
      <circle cx="19.2" cy="4.8" r="1.4" fill="currentColor" />
    </>
  ),
  // Broadcast
  marketing: (
    <>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6" />
      <path d="M5.3 5.3a9.5 9.5 0 0 0 0 13.4M18.7 5.3a9.5 9.5 0 0 1 0 13.4" />
    </>
  ),
  // Funnel
  sales: (
    <>
      <path d="M3.5 5h17l-6.5 8v6.5l-4 1.5V13z" />
      <path d="M7.5 9h9" />
    </>
  ),
  // Network
  technology: (
    <>
      <circle cx="5" cy="6" r="1.8" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="7" r="1.8" />
      <circle cx="19" cy="17" r="1.8" />
      <path d="M6.6 7l3.8 3.9M6.6 17l3.8-3.9M13.7 11.2l3.6-3.2M13.7 12.8l3.6 3.2" />
    </>
  ),
  // Dashboard bars
  operations: (
    <>
      <path d="M3.5 20h17" />
      <path d="M6 20v-5M10 20v-8M14 20v-6M18 20V6" />
    </>
  ),
  // Live signal
  signals: <path d="M2.5 12h4l2.2-6 4.6 12 2.2-6h6" />,
}

export function TopicIcon({ topic, className = '' }: { topic: TopicId | 'all'; className?: string }) {
  return (
    <svg
      className={`topic-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[topic]}
    </svg>
  )
}
