import { RouteDefinition, Navigate } from 'solid-app-router'
import libraryRoute, {
  LIBRARY_PATH,
  DEFAULT_LIBRARY_PATH,
} from '~/library/route'  // Adjusting path to use the alias '~'
import playerRoute from '~/player/route'  // Adjusting path to use the alias '~'
import detailsRoutes from '~/details/route'  // Adjusting path to use the alias '~'
import searchRoute from '~/search/route'  // Adjusting path to use the alias '~'
import settingsRoute from '~/settings/route'  // Adjusting path to use the alias '~'
import aboutRoute from '~/about/route'  // Adjusting path to use the alias '~'
import notFoundRoute from '~/not-found/route'  // Adjusting path to use the alias '~'

export const ROUTES: RouteDefinition[] = [
  libraryRoute,
  playerRoute,
  ...detailsRoutes,
  searchRoute,
  settingsRoute,
  aboutRoute,
  {
    path: '/',
    children: [{ path: '/' }, { path: LIBRARY_PATH }],
    element: () => <Navigate href={DEFAULT_LIBRARY_PATH} />,
  },
  notFoundRoute,
]
