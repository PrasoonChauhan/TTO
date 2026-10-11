/// <reference types="vite/client" />

declare module 'virtual:work' {
  const work: unknown[]
  export default work
}

declare module 'virtual:insights' {
  export const articles: unknown[]
  export const authors: Record<string, unknown>
}

declare module 'virtual:insight-bodies' {
  const bodies: Record<string, () => Promise<{ default: { html: string } }>>
  export default bodies
}
