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

// src/pages/auth/route.tsx

import { RouteDefinition, Navigate } from 'solid-app-router';

// Define the routes for static HTML pages
export const ROUTES: RouteDefinition[] = [
  // Redirect to static HTML login/signup pages
  {
    path: '/login',
    element: () => {
      window.location.href = '/login.html';  // Directly redirect to login.html
      return null;
    },
  },
  {
    path: '/signup',
    element: () => {
      window.location.href = '/signup.html';  // Directly redirect to signup.html
      return null;
    },
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
];
