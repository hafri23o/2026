import { createApp } from 'solid-utils';
import { Router, Route, Routes } from 'solid-app-router';
import { MusicImagesProvider } from './components/music-image/data-context';
import { MenuProvider } from './components/menu/menu';
import { RootStoresProvider } from './stores/stores';
import { ModalsProvider } from './components/modals/modals';
import { ErrorPage } from './pages/error/error';
import { App } from './pages/app/app';
import LoginPage from './pages/login/login';  // Corrected import

// Firebase initialization (if used)
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase config - Replace with your actual Firebase credentials
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

// Function to check if the user is logged in (example logic)
const isLoggedIn = () => {
  return localStorage.getItem('userLoggedIn') === 'true';
};

// Function to handle initial render
const initialRender = () => {
  // If user is logged in, show main app, otherwise show login page
  if (isLoggedIn()) {
    createApp(App)
      .use(Router)
      .use(ErrorPage)
      .use(MusicImagesProvider)
      .use(RootStoresProvider)
      .use(ModalsProvider)
      .use(MenuProvider)
      .mount('body');
  } else {
    // Display the login page when user is not logged in
    createApp(() => (
      <Router>
        <Routes>
          <Route path="/" component={LoginPage} />
          <Route path="/app" component={App} />
        </Routes>
      </Router>
    ))
      .use(RootStoresProvider)
      .use(MusicImagesProvider)
      .use(ModalsProvider)
      .mount('body');
  }
};

// Run initial render logic after browser check
if (window.isSupportedBrowser !== false) {
  initialRender();
}
