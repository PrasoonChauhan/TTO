# Work: how to add or edit a success story

Every success story is one Markdown file in this folder. The site reads them when it builds; there is no backend.

- **Add a story:** copy `_template.md`, rename it (e.g. `acme-labs.md`), fill it in.
- **Show it on the home page:** set `featured: true`. Home shows up to **4** featured stories, lowest `order` first.
- **Show it only on /work/:** set `featured: false`. Every story always appears on /work/.
- **Reorder:** change `order` (1 = first). Applies to both pages.
- **Hide a story:** rename the file to start with `_` (e.g. `_acme-labs.md`).

Files starting with `_` and this README are ignored. If a required field is missing, the build stops and names the file and field.

To see which stories are on the home page, open `/work/?edit`. Each story shows its file name, its home status, and an **Edit file** link to this file on GitHub.

## Fields

| Field | Required | What it is |
| --- | --- | --- |
| `brand` | yes | Client name, shown as the story title. |
| `sector` | yes | Short label above the title, e.g. `Fintech`. |
| `featured` | no | `true` to show on the home page. Default `false`. |
| `order` | no | Sort position, 1 = first. Default: last. |
| `logo` | no | Path to the client logo in `/public`, e.g. `/work/acme/logo.svg`. Monochrome SVG works best. |
| `services` | yes | List shown on the cover slide. |
| `gap` | yes | `key` (Value, Sales, Inbound or Cost), `from` (the problem) and `to` (the outcome). |
| `metrics` | yes | Exactly two numbers that count up beside the slides: `value`, `label`, optional `prefix`, `suffix`, `decimals`. |
| `palette` | yes | Slide colours: `bg`, `ink`, `accent`, `soft` (hex). |
| `slides` | yes | The deck, in order. See below. |
| Text below the `---` | yes | The summary paragraph shown beside the slides. |

## Slides

Each slide has a `type`. Mix them in any order. `caption` (optional) is the label shown on the deck.

| type | Fields |
| --- | --- |
| `image` | `src` (e.g. `/work/acme/01.jpg`), optional `alt`, `fit: contain` for diagrams or screenshots that must not be cropped |
| `cover` | none; uses brand, sector, services and logo |
| `gap` | `title`, `body` |
| `identity` | `line`, `colors` (list of hex) |
| `website` | `headline`, `cta`, optional `domain` |
| `results` | `items`: list of `value` and `label` |

**Uploading slide images:** put them in `public/work/<story-name>/` and reference them as `/work/<story-name>/<file>`. Export slides at **1600 × 1200 (4:3)**, JPG or WebP, under ~300 KB each.
