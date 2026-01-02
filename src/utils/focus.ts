/**
 * Focus utilities
 * Compatible with strict TypeScript, ESNext, and Vite
 */

export const doesElementContainFocus = (element: Element): boolean => {
  return element.matches(':focus-within')
}

export const findFocusedElement = (
  container: Element | Document,
): HTMLElement | null => {
  const element = container.querySelector(':focus')

  return element instanceof HTMLElement ? element : null
}

export const clickFocusedElement = (
  container: Element | Document,
): boolean => {
  const element = findFocusedElement(container)

  if (element) {
    element.click()
    return true
  }

  return false
}

/**
 * Focusable elements selector
 * Based on: https://stackoverflow.com/a/1600194
 */
const focusableElementQuery = `
  [tabindex]:not([tabindex='-1']),
  a[href]:not([tabindex='-1']),
  area[href]:not([tabindex='-1']),
  input:not([disabled]):not([tabindex='-1']),
  select:not([disabled]):not([tabindex='-1']),
  textarea:not([disabled]):not([tabindex='-1']),
  button:not([disabled]):not([tabindex='-1']),
  iframe:not([tabindex='-1']),
  [contenteditable="true"]:not([tabindex='-1'])
`

export const isElementFocusable = (element: Element): boolean => {
  return element.matches(focusableElementQuery)
}

export const findFocusableElement = (
  container: Element | Document,
): HTMLElement | null => {
  const element = container.querySelector(focusableElementQuery)

  return element instanceof HTMLElement ? element : null
}
