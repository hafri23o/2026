import { createEffect, onCleanup } from 'solid-js'

/**
 * Reactive document.title helper.
 * Safe for Vite build + strict TypeScript.
 */
export const useDocumentTitle = (
  title: string | (() => string),
): void => {
  // Guard for non-browser environments (Vite build, tests)
  if (typeof document === 'undefined') return

  const getTitle = () => (typeof title === 'string' ? title : title())

  const previousTitle = document.title
  let lastAppliedTitle = previousTitle

  createEffect(() => {
    const nextTitle = getTitle()
    document.title = nextTitle
    lastAppliedTitle = nextTitle
  })

  onCleanup(() => {
    // Defer to avoid clobbering titles set by other effects
    requestAnimationFrame(() => {
      if (document.title === lastAppliedTitle) {
        document.title = previousTitle
      }
    })
  })
}
