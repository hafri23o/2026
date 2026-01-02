/// <reference lib="webworker" />
/// <reference types="vite/client" />

declare module 'service-worker:*' {
  /**
   * Register the generated service worker.
   * Most Vite SW plugins expose a register() helper.
   */
  export function register(
    options?: RegistrationOptions
  ): Promise<ServiceWorkerRegistration | undefined>

  /**
   * Optional update trigger if supported by the plugin.
   */
  export function update(): Promise<void>

  /**
   * Optional unregister helper.
   */
  export function unregister(): Promise<boolean>

  /**
   * Fallback export for plugins that still expose the SW URL.
   */
  const swUrl: string
  export default swUrl
}
