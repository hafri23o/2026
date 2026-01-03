// src/pages/auth/route.tsx

import { Route, Routes } from 'solid-app-router';  // Correct import for Solid.js routing
import { LoginForm, SignupForm } from './auth'; // Correct import to use named exports from 'auth.tsx'

const AuthRoutes = () => {
  return (
    <Routes>
      {/* Define routes for Login and Signup forms */}
      <Route path="/login" component={LoginForm} />
      <Route path="/signup" component={SignupForm} />
    </Routes>
  );
};

export default AuthRoutes;
