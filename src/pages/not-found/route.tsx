import { RouteDefinition } from 'solid-app-router'
import { lazy } from 'solid-js'

// Define a lazy-loaded route for "Not Found" page
const route: RouteDefinition = {
  path: '/*all',  // This will match any route that doesn't exist
  component: lazy(() => import('~/components/not-found')),  // Importing the NotFound component lazily
}

export default route
