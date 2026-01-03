import { RouteDefinition } from 'solid-app-router' // solid-app-router is already compatible
import { lazy } from 'solid-js' // SolidJS lazy loading import

// Lazy load the 'player' component
const route: RouteDefinition = {
  path: '/player',
  component: lazy(() => import('~/components/player')), // Use '~' alias for correct path resolution
  children: [
    { path: '/' },
    { path: '/queue' },
  ],
}

export default route
