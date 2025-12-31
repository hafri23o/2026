import { RouteDefinition, Navigate } from 'solid-app-router'
import libraryRoute, {
  LIBRARY_PATH,
  DEFAULT_LIBRARY_PATH,
} from '../library/route'
import playerRoute from '../player/route'
import detailsRoutes from '../details/route'
import searchRoute from '../search/route'
import settingsRoute from '../settings/route'
import aboutRoute from '../about/route'
import notFoundRoute from '../not-found/route'
import authRoute from '../auth/route'  // Import the auth routes

export const ROUTES: RouteDefinition[] = [
  // Auth routes as the first route to be loaded
  {
    path: '/',
    children: [
      { path: '/login', component: authRoute.LoginForm },
      { path: '/signup', component: authRoute.SignupForm },
    ],
    element: () => <Navigate href="/login" />,  // Redirect to login page initially
  },
  
  // Other routes for the application
  libraryRoute,
  playerRoute,
  ...detailsRoutes,
  searchRoute,
  settingsRoute,
  aboutRoute,
  
  // Fallback route
  notFoundRoute,
]
