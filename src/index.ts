import { Router } from 'solid-app-router'
import { createApp } from 'solid-utils'
import { MusicImagesProvider } from './components/music-image/data-context'
import { MenuProvider } from './components/menu/menu'
import { RootStoresProvider } from './stores/stores'
import { ModalsProvider } from './components/modals/modals'
import { ErrorPage } from './pages/error/error'
import { App } from './pages/app/app'
import { LoginPage } from 'index.html' // Import your login page

// Function to check if the user is logged in
const isLoggedIn = () => {
  // Add your login logic here, for example:
  return localStorage.getItem('userLoggedIn') === 'true';
}

// Initial render logic
const initialRender = () => {
  // If the user is not logged in, render the login page
  if (!isLoggedIn()) {
    createApp(LoginPage).mount('body');
  } else {
    // Once logged in, render the main app
    createApp(App)
      .use(Router)
      .use(ErrorPage)
      .use(MusicImagesProvider)
      .use(RootStoresProvider)
      .use(ModalsProvider)
      .use(MenuProvider)
      .mount('body');
  }
}

// The supported browser features check file is very small,
// still in case if it doesn't load or loads late
// do not render app only if we explicitly know that browser is not supported.
// If app loads in unsupported browser because of race condition it's not a big deal.
if (window.isSupportedBrowser !== false) {
  initialRender();
}
