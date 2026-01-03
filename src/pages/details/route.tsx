import { RouteDefinition } from 'solid-app-router'
import { lazy } from 'solid-js'
import { DETAILS_PAGES_CONFIG } from '~/config'

// Lazy load the DetailsPage component for optimized bundle size
const DetailsPage = lazy(() => import('~/pages/details'))

// Define routes dynamically based on the DETAILS_PAGES_CONFIG
const routes: RouteDefinition[] = DETAILS_PAGES_CONFIG.map((page) => ({
  path: `${page.path}/:itemId`,  // Ensure the path includes the dynamic itemId
  component: () => <DetailsPage {...page} />,  // Spread page props to the component
}))

export default routes
