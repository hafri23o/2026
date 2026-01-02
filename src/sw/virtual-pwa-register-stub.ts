/**
 * Virtual PWA register stub
 *
 * Used when the PWA plugin is disabled or not available.
 * Must match the shape of `virtual:pwa-register`.
 */

export interface RegisterSWOptions {
  onNeedRefresh?: () => void
  onOfflineReady?: () => void
}

/**
 * Named export – matches:
 *   import { registerSW } from 'virtual:pwa-register'
 */
export function registerSW(_options?: RegisterSWOptions): () => void {
  return () => {
    /* no-op */
  }
}

/**
 * Default export – matches:
 *   import registerSW from 'virtual:pwa-register'
 */
export default function registerSWDefault(
  _options?: RegisterSWOptions,
): () => void {
  return () => {
    /* no-op */
  }
}
