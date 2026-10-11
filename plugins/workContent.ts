import fs from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import type { Plugin, ViteDevServer } from 'vite'

/**
 * Turns every content/work/*.md file into data at build time, exposed as the
 * module `virtual:work`. No backend and no runtime Markdown parser: editing a
 * file and rebuilding (or saving it while `npm run dev` runs) is the whole CMS.
 *
 * Files starting with "_" (e.g. _template.md) and README.md are ignored.
 */

const ID = 'virtual:work'
const RESOLVED = '\0' + ID
const DIR = path.resolve(import.meta.dirname, '../content/work')
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

const REQUIRED = ['brand', 'sector', 'gap', 'metrics', 'palette', 'slides'] as const

function fail(file: string, msg: string): never {
  throw new Error(`[work] content/work/${file}: ${msg}`)
}

function readAll() {
  if (!fs.existsSync(DIR)) return []
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')

  const items = files.map((file) => {
    const raw = fs.readFileSync(path.join(DIR, file), 'utf8')
    const m = raw.match(FRONTMATTER)
    if (!m) fail(file, 'missing the --- frontmatter block at the top of the file.')
    let data: Record<string, unknown>
    try {
      data = YAML.parse(m[1]) ?? {}
    } catch (e) {
      fail(file, `frontmatter is not valid YAML. ${(e as Error).message}`)
    }
    for (const key of REQUIRED) if (data[key] == null) fail(file, `"${key}" is required.`)
    if (!Array.isArray(data.slides) || data.slides.length === 0) fail(file, '"slides" needs at least one slide.')
    if (!Array.isArray(data.metrics) || data.metrics.length !== 2) fail(file, '"metrics" needs exactly two entries.')

    const summary = m[2].trim().replace(/\s+/g, ' ')
    if (!summary) fail(file, 'write the summary paragraph below the frontmatter.')

    return {
      ...data,
      file,
      slug: (data.slug as string) || file.replace(/\.md$/, ''),
      featured: data.featured === true,
      order: typeof data.order === 'number' ? data.order : 999,
      summary,
    }
  })

  items.sort((a, b) => a.order - b.order || String(a.brand).localeCompare(String(b.brand)))
  const featured = items.filter((i) => i.featured)
  if (featured.length > 4) {
    console.warn(
      `[work] ${featured.length} stories are marked featured; the home page shows the first 4 by "order": ` +
        featured.slice(0, 4).map((f) => f.file).join(', '),
    )
  }
  return items
}

export function workContent(): Plugin {
  let server: ViteDevServer | undefined
  const reload = (file: string) => {
    if (!server || !path.resolve(file).startsWith(DIR)) return
    const mod = server.moduleGraph.getModuleById(RESOLVED)
    if (mod) server.moduleGraph.invalidateModule(mod)
    server.ws.send({ type: 'full-reload' })
  }
  return {
    name: 'tto-work-content',
    resolveId: (id) => (id === ID ? RESOLVED : undefined),
    load(id) {
      if (id !== RESOLVED) return
      if (fs.existsSync(DIR)) for (const f of fs.readdirSync(DIR)) this.addWatchFile(path.join(DIR, f))
      return `export default ${JSON.stringify(readAll())}`
    },
    configureServer(s) {
      server = s
      s.watcher.add(DIR)
      s.watcher.on('add', reload)
      s.watcher.on('change', reload)
      s.watcher.on('unlink', reload)
    },
  }
}
