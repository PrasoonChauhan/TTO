/**
 * Site copy. One narrative runs through every section:
 *   Promise   - "From complex to what's next."
 *   Metaphor  - Three orbits: Idea → Traction → Scale. We work in the third.
 *   Proof     - Clarity, momentum, enduring value.
 * See docs/brand-narrative.md before writing copy for new sections.
 */

/** Single source for the contact address. Every mailto on the site uses this. */
export const CONTACT_EMAIL = 'hello@thethirdorbit.co'

export const nav = {
  links: [
    // Root-relative so the same links work from every page.
    { label: 'About', href: '/about/' },
    { label: 'Work', href: '/#work' },
    { label: 'Services', href: '/#services' },
    { label: 'Process', href: '/#process' },
    { label: 'Insight', href: '/#insight' },
  ],
  cta: { label: 'Connect', href: '/#connect' },
}

export const hero = {
  intro: {
    eyebrow: '(Strategy, brand & technology partner for startups)',
    headline: ['From complex', 'to what’s next.'],
    sub: 'We partner with ambitious startups to navigate complexity, unlock opportunity and build enduring value.',
    cta: 'Book an intro call',
    cue: 'Scroll to begin the orbit',
  },
  orbits: [
    {
      index: '01',
      name: 'The Idea',
      headline: ['Every company', 'starts as a spark.'],
      body: 'An idea, a conviction, a first orbit around something worth building.',
    },
    {
      index: '02',
      name: 'Traction',
      headline: ['Then you build,', 'sell and prove it.'],
      body: 'Prototype. First customers. First signal. Most founders learn to survive here.',
    },
    {
      index: '03',
      name: 'Scale',
      headline: ['Escaping orbit', 'takes clarity.'],
      body: 'Momentum got you here. Scaling takes strategy, brand and systems built to last.',
    },
  ],
  arrival: {
    eyebrow: 'You have arrived',
    headline: ['Welcome to', 'The Third Orbit.'],
    sub: 'This is where startups scale. And it is exactly where we work.',
    cta: 'Start a project',
  },
}

export const brands = {
  index: '(02)',
  label: 'Brands we’ve helped',
  title: ['Founders who', 'reached their', 'third orbit.'],
  body: 'From first raise to category leadership, these teams scaled with clarity, not just momentum.',
  note: '(Selected partners)',
}

export const gap = {
  index: '(03)',
  label: 'The gap',
  paragraphs: [
    'You’ve built something worth more than people can see.',
    'The product is solid. The customers are real. But sales still depend on you chasing, and the right people still aren’t finding you on their own.',
    'That gap costs more than revenue. It costs the confidence of knowing what’s working and what happens next.',
  ],
  /** Telemetry rows. `p` is the paragraph that lights each row. */
  readouts: [
    { key: 'Value', value: 'Under-seen', p: 0 },
    { key: 'Sales', value: 'Founder-led', p: 1 },
    { key: 'Inbound', value: 'Low signal', p: 1 },
    { key: 'Cost', value: 'Confidence', p: 2 },
  ],
  note: '(Where most startups stall: between orbit two and three)',
}

export const close = {
  index: '(04)',
  label: 'The answer',
  headline: { a: 'We close', b: 'that gap.' },
  note: '(Four gaps. One system.)',
  sub: 'Strategy, brand and technology, built as one system. So your company is seen for what it’s worth, sells without you chasing, and grows knowing what comes next.',
  /** Each row answers one readout from The gap (section 03). */
  rows: [
    {
      key: 'Value',
      gap: 'Under-seen',
      title: 'Positioning that makes your value obvious.',
      body: 'We sharpen your story and brand until the market sees what your customers already know.',
      tag: 'Brand & positioning',
    },
    {
      key: 'Sales',
      gap: 'Founder-led',
      title: 'A sales engine that runs without you.',
      body: 'Clear offers, narratives and systems your team can run, so growth stops depending on your calendar.',
      tag: 'Go-to-market',
    },
    {
      key: 'Inbound',
      gap: 'Low signal',
      title: 'Demand that finds you.',
      body: 'A website, content and channels built to attract the right buyers and convert them on their own.',
      tag: 'Website & growth',
    },
    {
      key: 'Cost',
      gap: 'Confidence',
      title: 'Clarity on what’s working and what’s next.',
      body: 'Metrics, dashboards and a roadmap, so every decision is grounded and the next move is obvious.',
      tag: 'Strategy & data',
    },
  ],
  cta: {
    prompt: ['Want to close the gap', 'for your startup?'],
    body: 'Tell us where you are. We’ll show you how we’d get you to your third orbit.',
    button: 'Let’s talk how',
  },
}

export const storiesCopy = {
  index: '(05)',
  label: 'Success stories',
  intro: 'Four founders. Four gaps closed.',
  all: { label: 'View all stories', href: '#stories' },
}

export const reviewsCopy = {
  index: '(06)',
  label: 'In their words',
  title: ['Founders, in their', 'own words.'],
  hint: '(Scroll to read. Open any card for the full review)',
  hintTouch: '(Swipe to read. Tap any card for the full review)',
}

export const help = {
  index: '(07)',
  label: 'What we can help with',
  note: '(Six disciplines. One team.)',
  /** Six buckets that cover a startup end to end. Order matches the visuals in Help/HelpVisuals.tsx. */
  items: [
    {
      name: 'Growth Strategy',
      line: 'Where to play, how to win, and the roadmap to get there.',
      includes: ['Positioning', 'Pricing', 'Go-to-market', 'Roadmaps', 'Fundraising narrative'],
    },
    {
      name: 'Brand & Identity',
      line: 'A brand that makes your value obvious at first glance.',
      includes: ['Brand strategy', 'Naming', 'Visual identity', 'Messaging', 'Guidelines'],
    },
    {
      name: 'Marketing',
      line: 'Demand that compounds, across the channels your buyers use.',
      includes: ['Content', 'SEO', 'Performance', 'Social', 'Launches'],
    },
    {
      name: 'Sales Funnels',
      line: 'A pipeline that converts without the founder in every deal.',
      includes: ['Funnel design', 'CRM', 'Sales narrative', 'Enablement', 'Lifecycle email'],
    },
    {
      name: 'Technology & AI',
      line: 'Websites, products and automation built to scale with you.',
      includes: ['Websites', 'Web & mobile apps', 'MVPs', 'AI integration', 'Automation'],
    },
    {
      name: 'Data & Operations',
      line: 'Clarity on what’s working, and systems that run on their own.',
      includes: ['Analytics', 'Dashboards', 'KPIs', 'Process design', 'Ops tooling'],
    },
  ],
}

export const processCopy = {
  index: '(08)',
  label: 'How we work',
  title: ['Five stages.', 'No guesswork.'],
  sub: 'Every engagement follows the same disciplined path, so you always know what happens next.',
  cta: 'Book a discovery call',
  stages: [
    {
      name: 'Discover',
      line: 'Your business, through your eyes.',
      body: 'A call with the founders. What you are building, what you have tried, where you want to be and where you need us.',
      meta: 'Video call',
    },
    {
      name: 'Research',
      line: 'We go deep, so you don’t have to.',
      body: 'Our team studies your market, your competitors and your business to find the gaps worth closing and what to improve.',
      meta: 'Our team · 1-2 weeks',
    },
    {
      name: 'Design',
      line: 'A plan built around your outcome.',
      body: 'A dedicated plan with clear goals, owners, timelines and the KPIs we will be measured on. Nothing starts until you sign off.',
      meta: 'Plan + sign-off',
    },
    {
      name: 'Deploy',
      line: 'We build it and ship it.',
      body: 'We execute the agreed plan across strategy, brand, growth and technology, with progress you can see every week.',
      meta: 'Execution',
    },
    {
      name: 'Iterate',
      line: 'Measured, refined, stabilised.',
      body: 'Results are tracked against the KPIs we set together. When the numbers say so, we refine the plan until growth holds.',
      meta: 'Ongoing · KPI-led',
      loop: 'Loops back to Design when KPIs call for it',
    },
  ],
}

export const faq = {
  index: '(09)',
  label: 'Questions',
  title: ['Straight', 'answers.'],
  sub: 'What founders usually ask before the first call. The short answer first, the detail after.',
  ask: {
    label: 'Ask your own',
    placeholder: 'Type your question',
    button: 'Send',
    email: CONTACT_EMAIL,
    note: '(A founder-facing reply within one working day)',
  },
  items: [
    {
      q: 'Is The Third Orbit right for my startup?',
      short: 'If you have traction, yes.',
      a: 'We work best with startups that have a real product and real customers, and now need to scale beyond the founders. Typically seed to Series B. If you are earlier than that, book a call anyway; we will tell you honestly whether we can help or who can.',
    },
    {
      q: 'What does working together actually look like?',
      short: 'One team. One plan.',
      a: 'It starts with a discovery call, then our research, then a written plan you sign off. After that we deploy and iterate against agreed KPIs. You get one senior team across strategy, brand, growth and technology, not a chain of hand-offs.',
    },
    {
      q: 'How long does an engagement take?',
      short: '4 to 16 weeks.',
      a: 'Research takes one to two weeks. Most focused projects, like a repositioning or a new website, ship in four to eight weeks. Broader growth programmes run longer, and many clients keep us on afterwards to iterate.',
    },
    {
      q: 'How much does it cost?',
      short: 'Scoped to the outcome.',
      a: 'After the discovery call and research we send a fixed proposal tied to the outcome we agreed, not an hourly estimate. Projects are fixed-fee; ongoing work runs on a monthly retainer. No surprises on the invoice.',
    },
    {
      q: 'Do we need all six disciplines?',
      short: 'No.',
      a: 'Most startups need two or three. The plan is built around your gap, so you only pay for what moves the number. If you already have a strong team in one area, we plug into it instead of replacing it.',
    },
    {
      q: 'How do you measure success?',
      short: 'Against KPIs we agree upfront.',
      a: 'Every plan names the metrics we will be judged on, such as pipeline, conversion, retention or time to close. You see progress every week, and when the numbers say the plan needs to change, we change it.',
    },
    {
      q: 'Who will we actually work with?',
      short: 'The people on the call.',
      a: 'The senior people you meet in discovery are the people who do the work. We keep teams small on purpose, so nothing gets lost between a pitch team and a delivery team.',
    },
  ],
}

export const outro = {
  index: '(10)',
  label: 'Final approach',
  status: 'Orbit 03 · Signal acquired',
  /** Each line drifts right by a different amount as you scroll. `arrow` puts → before the line. */
  lines: [
    { text: 'Let’s take' },
    { text: 'your startup' },
    { text: 'into its' },
    { text: 'third orbit', arrow: true },
  ],
  note: '(It starts with one conversation)',
  cta: 'Tell us your story',
}

export const footer = {
  links: [
    { label: 'About', href: '/about/' },
    { label: 'Work', href: '/#work' },
    { label: 'Services', href: '/#services' },
    { label: 'Process', href: '/#process' },
    { label: 'Questions', href: '/#faq' },
    { label: 'Start a project', href: '/#connect' },
  ],
  email: CONTACT_EMAIL,
  location: ['Based in Noida, Uttar Pradesh, India.', 'Working with founders worldwide.'],
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/thethirdorbit', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com/thethirdorbit.co', icon: 'instagram' },
  ],
  ai: {
    label: 'Ask AI about The Third Orbit',
    prompt:
      'What is The Third Orbit (thethirdorbit.co), the strategy, brand and technology partner for startups based in Noida, India? What do they do, who do they work with, and how do they work?',
    /** `url` receives the encoded prompt. Every click also copies the prompt as a fallback. */
    tools: [
      { label: 'Claude', icon: 'claude', url: (q: string) => `https://claude.ai/new?q=${q}` },
      { label: 'ChatGPT', icon: 'chatgpt', url: (q: string) => `https://chatgpt.com/?q=${q}` },
      { label: 'Gemini', icon: 'gemini', url: (q: string) => `https://gemini.google.com/app?q=${q}` },
      { label: 'Grok', icon: 'grok', url: (q: string) => `https://grok.com/?q=${q}` },
    ],
  },
  clock: { city: 'Noida', timeZone: 'Asia/Kolkata', offset: 'GMT +05:30' },
  wordmark: 'The Third Orbit',
}

export const about = {
  hero: {
    eyebrow: '(About The Third Orbit)',
    title: ['We work where', 'startups scale.'],
    sub: 'The Third Orbit is a strategy, brand and technology partner for founders who have built something real and are ready for what comes next.',
    meta: ['Noida, India', 'Working worldwide'],
  },
  name: {
    index: '(01)',
    label: 'The name',
    title: ['Every startup moves', 'through three orbits.'],
    orbits: [
      { n: '01', name: 'The Idea', body: 'A founder circles a conviction worth building. Everything is possible and nothing is proven yet.' },
      { n: '02', name: 'Traction', body: 'Prototype, first customers, first signal. The company runs on the founders’ energy and instinct.' },
      {
        n: '03',
        name: 'Scale',
        body: 'Momentum is no longer enough. Growth needs positioning, systems and data that work without the founders in every room.',
        ours: 'This is where we work.',
      },
    ],
    note: 'Most help is built for orbit one or two. We built The Third Orbit for the third.',
  },
  beliefs: {
    index: '(02)',
    label: 'What we believe',
    title: ['Five things we', 'won’t compromise on.'],
    items: [
      { t: 'Clarity beats volume.', b: 'A sharper story outperforms a louder one. We cut until what is left is obvious.' },
      { t: 'Senior people, small teams.', b: 'The people who scope the work do the work. No hand-offs between a pitch team and a delivery team.' },
      { t: 'Systems, not one-offs.', b: 'Strategy, brand, growth and technology built to work together, and to keep working after we step back.' },
      { t: 'Measured, not assumed.', b: 'Every plan names its KPIs upfront, and we change course when the numbers say so.' },
      { t: 'Honest by default.', b: 'If something will not work for a company your size, we say so early, even when it costs us the project.' },
    ],
  },
  facts: {
    index: '(03)',
    label: 'At a glance',
    items: [
      { v: 'Noida', l: 'Based in Uttar Pradesh, India' },
      { v: 'Worldwide', l: 'Working with founders across time zones' },
      { v: '6', l: 'Disciplines, one team' },
      { v: '5', l: 'Stages in every engagement' },
    ],
  },
}
