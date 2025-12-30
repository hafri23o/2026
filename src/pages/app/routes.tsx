import { RouteDefinition, Navigate } from 'solid-app-router';
import libraryRoute, {
  LIBRARY_PATH,
  DEFAULT_LIBRARY_PATH,
} from '../library/route';
import playerRoute from '../player/route';
import detailsRoutes from '../details/route';
import searchRoute from '../search/route';
import settingsRoute from '../settings/route';  // Import settingsRoute here
import aboutRoute from '../about/route';
import notFoundRoute from '../not-found/route';

export const ROUTES: RouteDefinition[] = [
  libraryRoute,
  playerRoute,
  ...detailsRoutes,
  searchRoute,
  settingsRoute, // Make sure settingsRoute is included here
  aboutRoute,
  {
    // Redirect the root path to the settings page
    path: '/',
    element: () => <Navigate href={settingsRoute.path} />,  // Use settingsRoute here
  },
  notFoundRoute,
];
