import { RouteDefinition, Navigate } from 'solid-app-router';
import libraryRoute, {
  LIBRARY_PATH,
  DEFAULT_LIBRARY_PATH,
} from '../library/route';
import playerRoute from '../player/route';
import detailsRoutes from '../details/route';
import searchRoute from '../search/route';
import settingsRoute from '../settings/route';
import aboutRoute from '../about/route';
import notFoundRoute from '../not-found/route';

export const ROUTES: RouteDefinition[] = [
  libraryRoute,
  playerRoute,
  ...detailsRoutes,
  searchRoute,
  settingsRoute,
  aboutRoute,
  {
    // This will load index.html or any component you'd like as the default page
    path: '/',
    element: () => <Navigate href={LIBRARY_PATH} />,
}
];
