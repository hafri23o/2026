import { createApp } from 'solid-utils';
import { Router, Route, Routes } from 'solid-app-router';
import { MusicImagesProvider } from './components/music-image/data-context';
import { MenuProvider } from './components/menu/menu';
import { RootStoresProvider } from './stores/stores';
import { ModalsProvider } from './components/modals/modals';
import { ErrorPage } from './pages/error/error';
import { App } from './pages/app/app';
import LoginPage from './pages/auth/auth.tsx';

// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check if user is logged in via Firebase
const isLoggedIn = () => auth.currentUser !== null;

const initialRender = () => {
  // Dynamically use eval to decide which component to render based on login status
  eval(`
    if (isLoggedIn()) {
      createApp(App)
        .use(Router)
        .use(MusicImagesProvider)
        .use(RootStoresProvider)
        .use(ModalsProvider)
        .use(MenuProvider)
        .mount('body');
    } else {
      createApp(() => (
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/app" element={<App />} />
          </Routes>
        </Router>
      ))
        .use(RootStoresProvider)
        .use(MusicImagesProvider)
        .use(ModalsProvider)
        .mount('body');
    }
  `);
};

if (window.isSupportedBrowser !== false) {
  initialRender();
}

