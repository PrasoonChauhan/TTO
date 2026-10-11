/**
 * DUMMY CONTENT. Fictional clients (the same placeholder brands shown in
 * "Brands we've helped"), invented metrics and slide copy. Replace with real
 * stories. Each story names the gap from section 03 that it closed.
 */

export type Palette = { bg: string; ink: string; accent: string; soft: string }

export type Story = {
  /** Must match a name in Brands/logos.tsx so the cover uses the same mark. */
  brand: string
  sector: string
  summary: string
  services: string[]
  gapClosed: { key: string; from: string; to: string }
  metrics: { value: number; prefix?: string; suffix?: string; decimals?: number; label: string }[]
  palette: Palette
  slides: {
    gap: { title: string; body: string }
    identity: { line: string; colors: string[] }
    website: { headline: string; cta: string }
    results: { value: string; label: string }[]
  }
}

export const stories: Story[] = [
  {
    brand: 'Kepler Systems',
    sector: 'Developer infrastructure',
    summary: 'Repositioning and a sales narrative for an infrastructure startup whose founders were still closing every deal themselves.',
    services: ['Positioning', 'Sales narrative', 'Website'],
    gapClosed: { key: 'Sales', from: 'Founder-led', to: 'Team-led' },
    metrics: [
      { value: 3.2, decimals: 1, suffix: '×', label: 'Qualified pipeline within two quarters' },
      { value: 41, suffix: '%', label: 'Shorter average sales cycle' },
    ],
    palette: { bg: '#0E1B3D', ink: '#EEF2FB', accent: '#6E9BFF', soft: '#1B2B57' },
    slides: {
      gap: { title: 'Great product. Every deal ran through the founders.', body: 'No repeatable story meant the team could not sell without them in the room.' },
      identity: { line: 'Infrastructure that disappears.', colors: ['#0E1B3D', '#6E9BFF', '#EEF2FB', '#1B2B57'] },
      website: { headline: 'Ship faster on infrastructure you never think about.', cta: 'Book a demo' },
      results: [
        { value: '3.2×', label: 'Pipeline' },
        { value: '41%', label: 'Faster cycle' },
        { value: '6', label: 'New AEs ramped' },
      ],
    },
  },
  {
    brand: 'Helix Bio',
    sector: 'Biotech platform',
    summary: 'Brand identity and investor story for a biotech platform translating complex science for partners and investors.',
    services: ['Brand identity', 'Investor narrative', 'Website'],
    gapClosed: { key: 'Value', from: 'Under-seen', to: 'Obvious' },
    metrics: [
      { value: 18, prefix: '$', suffix: 'M', label: 'Series A closed after the relaunch' },
      { value: 2.4, decimals: 1, suffix: '×', label: 'Inbound partner enquiries' },
    ],
    palette: { bg: '#0F2A22', ink: '#EAF5EF', accent: '#3DDC97', soft: '#1A3D32' },
    slides: {
      gap: { title: 'World-class science. Explained like a lab report.', body: 'Investors and partners could not see the value the customers already knew.' },
      identity: { line: 'Biology, made legible.', colors: ['#0F2A22', '#3DDC97', '#EAF5EF', '#1A3D32'] },
      website: { headline: 'Programmable biology for the next generation of medicine.', cta: 'Partner with us' },
      results: [
        { value: '$18M', label: 'Series A' },
        { value: '2.4×', label: 'Partner enquiries' },
        { value: '9 wks', label: 'To relaunch' },
      ],
    },
  },
  {
    brand: 'Nova Pay',
    sector: 'Fintech',
    summary: 'A new website and demand engine for a payments startup that the right buyers were not finding on their own.',
    services: ['Website', 'Content system', 'Demand generation'],
    gapClosed: { key: 'Inbound', from: 'Low signal', to: 'Compounding' },
    metrics: [
      { value: 212, prefix: '+', suffix: '%', label: 'Organic demo requests' },
      { value: 38, suffix: '%', label: 'Visitor-to-lead lift' },
    ],
    palette: { bg: '#1A1033', ink: '#F3EEFF', accent: '#9B6BFF', soft: '#2A1B4F' },
    slides: {
      gap: { title: 'Strong product. Invisible in search, silent on social.', body: 'Every lead came from a referral. Nothing compounded.' },
      identity: { line: 'Payments, without the paperwork.', colors: ['#1A1033', '#9B6BFF', '#F3EEFF', '#2A1B4F'] },
      website: { headline: 'Get paid in every currency, from one dashboard.', cta: 'Start free' },
      results: [
        { value: '+212%', label: 'Demo requests' },
        { value: '38%', label: 'Lead lift' },
        { value: '4.1×', label: 'Organic traffic' },
      ],
    },
  },
  {
    brand: 'Quanta AI',
    sector: 'AI analytics',
    summary: 'Growth metrics, board-ready dashboards and a 12-month roadmap for an AI startup scaling past its first 50 customers.',
    services: ['Growth strategy', 'Metrics & dashboards', 'Roadmap'],
    gapClosed: { key: 'Cost', from: 'Confidence', to: 'Clarity' },
    metrics: [
      { value: 27, suffix: '%', label: 'Net revenue retention lift' },
      { value: 4, suffix: ' wks', label: 'To the first board-ready dashboard' },
    ],
    palette: { bg: '#F1EEE7', ink: '#1C1B19', accent: '#FF5A1F', soft: '#E3DED3' },
    slides: {
      gap: { title: 'Growing fast. Nobody could say exactly why.', body: 'Decisions were made on instinct, and every board meeting started from scratch.' },
      identity: { line: 'Know what moves the number.', colors: ['#F1EEE7', '#FF5A1F', '#1C1B19', '#E3DED3'] },
      website: { headline: 'Answers from your data, before you ask.', cta: 'See it live' },
      results: [
        { value: '27%', label: 'NRR lift' },
        { value: '4 wks', label: 'To dashboards' },
        { value: '12 mo', label: 'Roadmap' },
      ],
    },
  },
]
