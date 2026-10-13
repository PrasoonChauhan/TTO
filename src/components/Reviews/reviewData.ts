/**
 * Founder reviews. Photos live in /public/reviews: square, cropped to head and
 * shoulders, at least 480px.
 *
 * To add a video review, add an item with kind: 'video' anywhere in the list:
 *   {
 *     kind: 'video',
 *     id: 'nova-video',
 *     founder: { ... },
 *     headline: 'Short pull quote shown on the card.',
 *     poster: '/reviews/nova-poster.jpg',  // 16:9 or portrait frame from the video
 *     src: '/reviews/nova.mp4',            // or any URL the <video> tag can play
 *     duration: '02:14',
 *   }
 * Cards, the track length and the dialog all adapt automatically.
 */

export type Founder = {
  name: string
  role: string
  /** Founder's LinkedIn profile. The name and photo on the card and in the dialog link here. */
  linkedin?: string
  /** Must match a name in Brands/logos.tsx to show the company mark. */
  company: string
  photo: string
}

type Base = { id: string; founder: Founder; headline: string }
export type TextReview = Base & { kind: 'text'; body: string }
export type VideoReview = Base & { kind: 'video'; poster: string; src: string; duration: string }
export type Review = TextReview | VideoReview

export const reviews: Review[] = [
  {
    kind: 'text',
    id: 'outrive-trails',
    founder: {
      name: 'Priyanshu Raj',
      role: 'Founder',
      company: 'Outrive Trails',
      photo: '/reviews/priyanshu-raj.webp',
      linkedin: 'https://www.linkedin.com/in/priyanshuraj21/',
    },
    headline: 'We stopped chasing leads that were never going to book.',
    body: 'Before The Third Orbit, a big part of our week went into following up with people who were never going to come on a trail. Every enquiry looked the same, so every one got the same attention, and the serious founders waited in the queue.\n\nThey designed a sales funnel that sorts this out before it ever reaches us. The right applicants arrive ready to talk, the rest are nurtured on their own, and our sales cycle is much shorter than it used to be. What surprised me even more was the inbound. Once they reworked our website and online presence, leads started coming in organically, from founders who already understood what Outrive is about.\n\nIf your team spends more time qualifying leads than closing them, talk to them. They fixed exactly that for us.',
  },
  {
    kind: 'text',
    id: 'zoku-zest',
    founder: {
      name: 'Harsh Kapoor',
      role: 'Head of Growth & Operations',
      company: 'Zoku Zest',
      photo: '/reviews/harsh-kapoor.webp',
      linkedin: 'https://www.linkedin.com/in/harsh-kapoor-94bb47226/',
    },
    headline: 'They understand the buyer before they spend a single rupee on ads.',
    body: 'Most agencies start with the ad. The Third Orbit starts with the buyer. Before any campaign went live, they spent more time understanding how our customers see anime, streetwear and price than they spent making the creative. They are honestly obsessed with that part, and it shows in the numbers.\n\nWe are getting the best ROAS we have ever had, at a cost I did not think was possible for a brand our size. The marketing feels like it was made by people who know our community, because by the time they build anything, they do.\n\nIf you are a D2C founder spending on campaigns that look good but do not sell, let them study your customer first. That is where the results come from.',
  },
  {
    kind: 'text',
    id: 'brew-lab',
    founder: {
      name: 'Bhavik Dhuphur',
      role: 'COO',
      company: 'Brew Lab',
      photo: '/reviews/bhavik-dhuphur.webp',
      linkedin: 'https://www.linkedin.com/in/bhavikdhuphur/',
    },
    headline: 'They know how to build a consumer brand, and they hold their nerve.',
    body: 'Building a brand for consumers is its own game, and The Third Orbit understands the B2C market better than anyone we have worked with. They knew what our buyers respond to, how a brand earns a place in someone’s routine, and what it takes to get there.\n\nWhat stood out even more was their discipline. They set the plan and the KPIs they would be measured on, and then they stuck to them. No panicked changes after a slow week, no chasing every new trend. A patient team, confident in its plan, that delivered what it promised.\n\nFor any founder building a consumer brand, that mix of market sense and patience is rare. I would recommend them without hesitation.',
  },
  {
    kind: 'text',
    id: 'shyphan-ai',
    founder: {
      name: 'Sahil Rai',
      role: 'Growth Head',
      company: 'Shyphan Ai Solutions',
      photo: '/reviews/sahil-rai.webp',
      linkedin: 'https://www.linkedin.com/in/sahilraiii/',
    },
    headline: 'For the first time, we knew exactly what the quarter was for.',
    body: 'What I value most about The Third Orbit is how they plan. Every month and every quarter comes with a detailed plan, clear KPIs, and a decision already made about what we change if something does not work.\n\nFor the first time, the whole team knew what we were doing this quarter, what we expected from it, and what the next move would be if a number fell short. Everything is mapped out. No guesswork, and no trying everything at once to see what sticks.\n\nIf you are leading growth and tired of reacting week to week, this is the team that gets you thinking a quarter ahead.',
  },
  {
    kind: 'text',
    id: 'mithila-shri',
    founder: {
      name: 'DD Tiwari',
      role: 'Founder',
      company: 'Mithila Shri',
      photo: '/reviews/dd-tiwari.webp',
    },
    headline: 'Working with them gave me real peace of mind.',
    body: 'The best thing I can say about The Third Orbit is that working with them gave me peace of mind. Once I handed over our marketing and the digital side of the business, I genuinely stopped thinking about it.\n\nThey come to me with clear plans: what to do, how to do it, and when to change course. They bring the results, the next plan and the changes without me having to ask about anything. They also tell me plainly what to do and what not to do.\n\nFor a founder running a business on the ground, that is everything. I focus on my customers and my products, and I know the rest is in good hands.',
  },
]
