import { useEffect, type RefObject } from 'react'
import { registerThemeZone, type NavTheme } from '../lib/theme'

/** Declares which surface this section shows under the nav. */
export function useSectionTheme(ref: RefObject<HTMLElement | null>, theme: NavTheme) {
  useEffect(() => {
    if (!ref.current) return
    return registerThemeZone(ref.current, theme)
  }, [ref, theme])
}
