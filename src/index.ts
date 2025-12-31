import { Router } from 'solid-app-router'
import { createApp } from 'solid-utils'
import { MusicImagesProvider } from './components/music-image/data-context'
import { MenuProvider } from './components/menu/menu'
import { RootStoresProvider } from './stores/stores'
import { ModalsProvider } from './components/modals/modals'
import { ErrorPage } from './pages/error/error'
import { App } from './pages/app/app'

// Assuming window.isSupportedBrowser is declared elsewhere in your app
if (window.isSupportedBrowser !== false) {
  createApp(App)
    .use(Router)
    .use(ErrorPage)
    .use(MusicImagesProvider)
    .use(RootStoresProvider)
    .use(ModalsProvider)
    .use(MenuProvider)
    .mount('body')
} else {
  console.log("Browser not supported!");
}
