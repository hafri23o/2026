import { toggleReverseArray } from '~/utils'

/**
 * Fade animation helper using the Web Animations API.
 * Compatible with ESNext + strict TypeScript.
 */
export const animateFade = (
  element: Element,
  fadeOut: boolean,
  options: KeyframeAnimationOptions,
): Animation => {
  const keyframes: PropertyIndexedKeyframes = {
    opacity: toggleReverseArray([0, 1], fadeOut),
  }

  return element.animate(keyframes, options)
}

/**
 * No-op animation helper.
 * Useful for preserving animation pipelines.
 */
export const animateEmpty = (
  element: Element,
  options: number | KeyframeAnimationOptions,
): Animation => {
  return element.animate([], options)
}
