/**
 * DUMMY CONTENT. Fictional founders and reviews for layout. Photos are
 * placeholder portraits from randomuser.me; use real photos, ideally square
 * and at least 600px, in /public/reviews.
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

/** DEMO: every placeholder founder points at the same profile. Replace per founder. */
const DEMO_LINKEDIN = 'https://www.linkedin.com/in/princeperspect'

export const reviews: Review[] = [
  {
    kind: 'text',
    id: 'kepler',
    founder: { name: 'Daniel Ortiz', role: 'Co-founder & CEO', company: 'Kepler Systems', photo: '/reviews/founder-1.jpg', linkedin: DEMO_LINKEDIN },
    headline: 'For the first time, our team closes deals without me in the room.',
    body: 'We had a great product and a sales process that lived entirely in my head. Every enterprise deal needed me on the call, and that was capping our growth.\n\nThe Third Orbit rebuilt our positioning from the ground up, gave us a sales narrative the whole team could own, and turned the website into something prospects actually forward to their buying committee. Within two quarters our pipeline had tripled and our newest account executives were closing on their own.\n\nThe biggest change is how I spend my week. I am back to building product, and the company no longer depends on my calendar to grow.',
  },
  {
    kind: 'text',
    id: 'helix',
    founder: { name: 'Mei Tanaka', role: 'Founder & Chief Science Officer', company: 'Helix Bio', photo: '/reviews/founder-2.jpg', linkedin: DEMO_LINKEDIN },
    headline: 'Investors finally understood what we had built.',
    body: 'Our science was strong, but we explained it like a lab report. Partners nodded politely and moved on. The team spent weeks with our scientists until they could explain the platform better than we could, then built an identity and investor story around it.\n\nWe closed our Series A three months after the relaunch.',
  },
  {
    kind: 'text',
    id: 'nova',
    founder: { name: 'Marcus Reid', role: 'CEO', company: 'Nova Pay', photo: '/reviews/founder-3.jpg', linkedin: DEMO_LINKEDIN },
    headline: 'Our website went from a brochure to our best salesperson.',
    body: 'Every customer we had came from a referral, which felt great until it stopped scaling. We needed buyers to find us on their own.\n\nThe Third Orbit rebuilt the website, set up a content system our small team can actually keep running, and connected it all to a clear demand engine. Organic demo requests are up more than 200 percent, and the leads that come in already understand what we do. Sales calls now start at the second conversation, not the first.\n\nWhat I valued most was the honesty. They told us early which channels would not work for a company our size, and saved us months of wasted spend.',
  },
  {
    kind: 'text',
    id: 'quanta',
    founder: { name: 'Priya Nair', role: 'Co-founder & COO', company: 'Quanta AI', photo: '/reviews/founder-4.jpg', linkedin: DEMO_LINKEDIN },
    headline: 'Every board meeting now starts from clarity, not guesswork.',
    body: 'We were growing fast and nobody could say exactly why. The Third Orbit built the metrics, the dashboards and a twelve-month roadmap that the whole leadership team signed up to. We now know what moves the number, and so does our board.',
  },
  {
    kind: 'text',
    id: 'arcfield',
    founder: { name: 'Tom Becker', role: 'Founder', company: 'Arcfield', photo: '/reviews/founder-5.jpg', linkedin: DEMO_LINKEDIN },
    headline: 'Calm, senior and fast.',
    body: 'They understood the business in a week and never once needed hand-holding.',
  },
  {
    kind: 'text',
    id: 'lumen',
    founder: { name: 'Sara Lindqvist', role: 'CEO', company: 'Lumen', photo: '/reviews/founder-6.jpg', linkedin: DEMO_LINKEDIN },
    headline: 'They treated our company like it was their own.',
    body: 'I have worked with agencies before, and the pattern was always the same: a beautiful pitch, a junior team, and a deliverable that never quite fit how we actually sell. This was different from the first workshop.\n\nThe Third Orbit asked uncomfortable questions about our pricing, our ideal customer and the deals we kept losing. The answers reshaped the brand, the website and how our sales team tells the story. They challenged us when we were wrong and backed us when we were right.\n\nSix months later we have a brand our team is proud of, a website that converts, and a much clearer view of where the next stage of growth comes from. If you are a founder stuck between traction and scale, talk to them.',
  },
]
