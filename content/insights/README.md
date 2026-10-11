# Insights: how to publish an article

Every article is one Markdown file in this folder. The build turns each file into its own page at `/insights/<file-name>/`, with search tags, a social card and the article text baked in for search engines. There is no backend.

- **Publish:** copy `_template.md`, rename it (the file name becomes the URL, e.g. `pricing-for-seed.md` gives `/insights/pricing-for-seed/`), fill it in.
- **Unpublish:** rename the file to start with `_`.
- **Lead story:** the newest article is shown large at the top of /insights/. To pin a different one, set `featured: true` on it (only one should be featured).
- **Authors:** listed in `content/authors.yml`; reference one with `author: <id>`.

If a required field is missing or wrong, the build stops and names the file and field.

## Fields

| Field | Required | What it is |
| --- | --- | --- |
| `title` | yes | Headline. |
| `excerpt` | yes | One or two sentences. Used on cards, under the title and as the search description. |
| `topic` | yes | One of `strategy`, `brand`, `marketing`, `sales`, `technology`, `operations`, `signals`. |
| `date` | yes | Publish date, `2026-10-12`. Lists are sorted newest first. |
| `author` | yes | An id from `content/authors.yml`. |
| `updated` | no | Date of the last meaningful update. |
| `tags` | no | List of keywords, e.g. `[Pricing, SaaS]`. |
| `takeaways` | no | Three or four bullet points shown in a "Key takeaways" box at the top. |
| `cover` | no | Image in `/public`, e.g. `/insights/pricing/cover.jpg` (2100 × 900). Without it a cover is drawn for the topic. |
| `coverAlt` | no | Description of the cover image. |
| `featured` | no | `true` pins this article as the lead story. |
| `seoTitle` / `seoDescription` | no | Override the title and excerpt for search results only. |

## Writing the body

Standard Markdown below the second `---`:

- `## Heading` and `### Subheading` (these build the "On this page" menu; do not use a single `#`).
- `**bold**`, `*italic*`, lists, links, tables.
- `> A line` becomes a large pull quote.
- `![Alt text](/insights/my-article/chart.png "Optional caption")` adds an image with a caption. Put images in `public/insights/<file-name>/`.

Reading time is calculated automatically.
