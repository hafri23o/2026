import { lazy } from 'solid-js'
import { RouteDefinition } from 'solid-app-router'

// Use path alias to import routes dynamically
const route: RouteDefinition = {
  path: '/search',
  component: lazy(() => import('~/pages/search')), // Use path alias to load the search component
  children: [
    { path: '/' },
    { path: '/:searchTerm' },
  ],
}

export default route
