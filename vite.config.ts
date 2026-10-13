import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { workContent } from './plugins/workContent.ts'
import { insightsContent } from './plugins/insightsContent.ts'

export default defineConfig({
  // insightsContent also adds one page per article (insights/<slug>/index.html).
  plugins: [react(), workContent(), insightsContent()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about/index.html'),
        work: resolve(import.meta.dirname, 'work/index.html'),
        insights: resolve(import.meta.dirname, 'insights/index.html'),
        // Served by the host for unknown URLs (Netlify, Vercel, GitHub Pages, Cloudflare Pages).
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
})
