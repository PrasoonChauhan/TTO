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

Each slide has a `type`. Mix them in any order and use as many as the story needs. `caption` (optional) is the label shown under the deck while the slide plays, e.g. `Positioning`. Tell each client's story in its own way; `zoku-zest.md` is a worked example.

| type | Fields |
| --- | --- |
| `cover` | none; uses brand, sector, services and logo |
| `gap` | `title`, `body` |
| `split` | `title`, optional `body`, `image`, optional `alt`, `side: left` to put the photo on the left (default right) |
| `gallery` | `title`, optional `body`, `images` (list of `src` and optional `alt`, 2 to 5 work best), optional `ratio` of each image (default `4 / 5`), optional `stat` (`value`, `label`) shown large at the top right |
| `website` | a real screenshot: `image`, optional `alt`, `title`, `domain`. Or a drawn page: `headline`, `cta`, optional `domain` |
| `flow` | `title`, optional `body`, `steps` (list of short labels), optional `highlight` (step number to mark, 1 = first) |
| `identity` | `line`, `colors` (list of hex) |
| `results` | `items`: list of `value` and `label` |
| `image` | a full-slide picture: `src`, optional `alt`, `fit: contain` for diagrams or screenshots that must not be cropped |

**Uploading slide images:** put them in `public/work/<story-name>/` and reference them as `/work/<story-name>/<file>`. Full-slide `image` slides: export at **1600 × 1200 (4:3)**. Photos for `split`, `gallery` and `website`: any size, at least 800 px on the long side, cropped close to the ratio they are shown at. JPG or WebP, under ~300 KB each.
