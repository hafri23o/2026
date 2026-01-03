import { RouteDefinition } from '@solidjs/router' // Correcting the import for Solid Router
import { lazy } from 'solid-js'

const route: RouteDefinition = {
  path: '/settings',
  component: lazy(() => import('~/settings')), // Using path alias for import
}

export default route
