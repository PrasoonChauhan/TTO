# The Third Orbit: brand narrative

Read this before writing copy or motion for any new section.

## The idea in one line

**From complex to what's next.** This is the promise, and every section should pay it off.

## The metaphor

A startup moves through three orbits.

1. **The Idea.** A founder circles a single conviction.
2. **Traction.** Prototype, first customers, first signal. Most companies learn to survive here.
3. **Scale.** Escaping orbit takes clarity, not just momentum. This is where we work.

The hero tells this story literally: the moon completes one revolution per orbit and moves outward each time. It arrives at "Welcome to The Third Orbit."

## Voice

- Short, declarative sentences. Confident, never hype.
- Speak to founders as peers: "you build, sell and prove it."
- Use space language sparingly and abstractly: orbit, gravity, escape velocity, signal. Never astronauts, rockets or emoji.
- Keep "clarity", "momentum" and "enduring value" as recurring words.

## Visual rules carried from the hero

- Daylight at the surface: the hero uses `--regolith` (sunlit grey stone) with a soft key light from the upper left, plus film grain sitewide. The void (`--void-black`) is where depth and the story's payoff live.
- Thin 1px orbital lines, the monochrome planet, and the moon dot from the logo mark.
- Type: Saira Condensed 800 is reserved for the Final approach statement only. Archivo Variable (weight 700, width 112%, tracking -0.045em, leading 0.88) for display. Geist for body. Geist Mono for uppercase labels.
- Headline lines always reveal through masks: yPercent 140 to 0, `power4.out`.
- Hover pattern: siblings dim, the focused item stays at full strength. Grid items add 1px corner brackets that lock on.
- Section labels: a mono index like "(02)" plus the small moon dot before the label.
- Nav "you are here": the same moon dot sits under the active link (page, or home section via scroll) and glides to any hovered link (src/hooks/useActiveLink.ts).
- CTAs: a solid block with an inset diagonal-arrow tile. Colours never change on hover. Hover is a synced slot-reel roll: label rolls up, arrow rolls toward its head, mouse-out reverses. No magnetic drift on buttons.

## Site rules

- Every page ends with `<SiteFooter />` (src/components/SiteFooter.tsx): the "Final approach" statement (section 10) followed by the footer. Never render `<Footer />` on its own.
- Lead form: buttons call leadFormLink(source) (src/lib/leadForm.ts); the form is mounted once per page by SiteFooter and posts to a Google Apps Script (google-apps-script/). With no endpoint or on failure it hands off to WhatsApp/email, so it never dead-ends.
- The contact address lives only in `CONTACT_EMAIL` in src/content/copy.ts (hello@thethirdorbit.co).
- No em or en dashes anywhere; use a hyphen.

## Section copy map

| Section | Role in the story |
| --- | --- |
| Hero | The three orbits. Arrival. |
| Brands we’ve helped | Stays in the void: "Founders who reached their third orbit." Logos are placeholders in src/components/Brands/logos.tsx. |
| The gap | Names what keeps founders in orbit two. Pinned on desktop: words light up with scroll while a telemetry panel (orbit diagram, readouts) tracks each beat. |
| We close that gap | The answer, in daylight. Whole screen crossfades void to lunar-white. Headline halves slide together as a "Gap 100% to 00%" readout counts down. Ledger answers each readout from The gap, then a "Let’s talk how" CTA. Anchor: #answer. |
| What we can help with (#services) | Six disciplines (Growth Strategy, Brand & Identity, Marketing, Sales Funnels, Technology & AI, Data & Operations). Dark. Pinned on desktop: scroll steps through them, hover or arrows jump. Left panel shows a live 1px-line animated visual per discipline (src/components/Help/HelpVisuals.tsx). |
| Success stories (#work on home, /work/ page) | Driven by Markdown: one file per story in content/work/ (field guide in content/work/README.md). `featured: true` + `order` puts up to 4 on home; /work/ lists all in the same design. Slides are built-in types or uploaded images. /work/?edit shows file, home status and a GitHub edit link per story. |
| How we work (#process) | Light again (dawn crossfade from Help). Five stages: Discover, Research, Design, Deploy, Iterate. Unpinned horizontal timeline whose line fills with scroll; nodes turn into the planet dot as reached; Iterate notes it loops back to Design on KPIs. Vertical on mobile. |
| Questions (#faq) | Light. Seven FAQs, one open at a time; each answer leads with a short verdict in the display face. Pinned aside has an "Ask your own" field that opens a pre-filled email (placeholder address in copy.ts). |
| Insights (/insights/) | Markdown-driven articles (content/insights/, guide in its README). Seven topics: the six disciplines plus Signals. Listing: newest (or `featured`) as a large lead, icon filter chips (?topic=), grid. Each article gets its own generated page with SEO tags, JSON-LD and pre-rendered text; TOC, takeaways, share, author box, related notes. Build also emits sitemap.xml and robots.txt. |
| In their words (#reviews) | Founder reviews in the void. Dusk crossfade from Success stories. Pinned horizontal track on desktop, swipe carousel on mobile. Cards clamp to whole lines with an ellipsis; a native dialog shows the full review, founder photo and a link to their story. Supports kind: "video" cards (see src/components/Reviews/reviewData.ts). |
| Final approach (#connect) | Pre-footer statement in the void: "Let’s take your startup into its third orbit". Saira Condensed 800 (used only here). Sticky stage in a 210vh section; lines drift left to right by different small amounts; planet horizon rises, moon crosses. "Tell us your story" CTA. |
| Footer (#footer, every page) | Dark. Big rolling nav links, studio email + Noida, Ask AI (Claude, ChatGPT, Gemini, Grok with a pre-filled prompt, also copied to clipboard), LinkedIn + Instagram, live Noida clock, Back to top, full-width wordmark. |
| About page (/about/) | Separate page: hero with the three-orbit system, The name (three orbits), What we believe (five principles) + At a glance facts, dark CTA. Nav and footer links are root-relative and deep-link into home sections. |
