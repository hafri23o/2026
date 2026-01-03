import { createEffect } from 'solid-js'
import { setElementVars } from '@vanilla-extract/dynamic'
import { registerServiceWorker } from '~/sw/register-sw'  // Updated to use path alias
import { useAudioPlayer } from '~/audio/create-audio-player'  // Updated to use path alias
import { usePlayerStore } from '~/stores/stores'  // Updated to use path alias
import { installGlobalRipple } from '~/helpers/ripple/install-global-ripple'  // Updated to use path alias
import { useDarkThemeEnabled } from '~/utils'  // Updated to use path alias
import { colorsTheme } from '~/styles/vars.css'  // Updated to use path alias
import * as styles from '~/styles/app.css'  // Updated to use path alias
import { toast } from '~/components/toast/toast'  // Updated to use path alias

export const useSetupApp = (): void => {
  useAudioPlayer()

  const [playerState] = usePlayerStore()

  const isDarkTheme = useDarkThemeEnabled()

  const titlebarElement = document.querySelector(
    'meta[name="theme-color"]',
  ) as HTMLMetaElement

  createEffect(() => {
    const isDark = isDarkTheme()
    const argb = playerState.activeTrack?.primaryColor

    const doc = document.documentElement

    if (argb === undefined) {
      type EmptyTheme = {
        [key in keyof typeof colorsTheme]: string
      }

      const emptyTheme = Object.fromEntries(
        Object.entries(colorsTheme).map(([key]) => [key, '']),
      ) as EmptyTheme

      setElementVars(doc, colorsTheme, emptyTheme)
      return
    }

    // Dynamically importing theme-related module
    import('~/helpers/app-theme').then((module) => {
      const scheme = module.getAppTheme(argb, isDark)
      setElementVars(doc, colorsTheme, scheme)
      titlebarElement.content = scheme.surface
    })
  })

  // Registering the service worker and handling updates
  registerServiceWorker({
    onNeedRefresh(updateSW) {
      toast({
        message: 'An app update is available',
        duration: false,
        controls: [
          {
            title: 'Reload',
            action: () => {
              updateSW()
            },
          },
        ],
      })
    },
  })

  // Installing global ripple effect
  installGlobalRipple(styles.interactable)
}
