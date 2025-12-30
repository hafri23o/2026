import { RouteDefinition } from 'solid-app-router'
import { CONFIG, LIBRARY_PATH, DEFAULT_LIBRARY_PATH } from './config'
import { LibraryPage } from './library-tab'
import Library from './library'

export { LIBRARY_PATH, DEFAULT_LIBRARY_PATH }

// Define the library routes
const libraryRoutes: RouteDefinition[] = CONFIG.map((page) => ({
  path: page.path,
  component: () => <LibraryPage {...page} />,
}))

// Define the library route separately, but keep the default to index.html
const route: RouteDefinition = {
  path: '/library',  // The library route
  component: Library,  // The component for the library
  children: libraryRoutes,  // Nested library pages
}

export default route
