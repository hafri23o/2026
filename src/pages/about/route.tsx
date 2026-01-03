import { RouteDefinition } from 'solid-app-router'
import { lazy } from 'solid-js'

// Lazy-load the AboutPage component
const AboutPage = lazy(() => import('~/pages/about/about'))  // Adjust the import path based on your actual directory structure

// Define the route configuration
const route: RouteDefinition = {
  path: '/about',
  component: AboutPage,
}

export default route
