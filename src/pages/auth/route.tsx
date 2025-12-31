// src/pages/auth/route.tsx

import { Route, Routes } from 'solid-app-router';
import { LoginForm, SignupForm } from './auth'; // Corrected import to use named exports

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" component={LoginForm} />
      <Route path="/signup" component={SignupForm} />
    </Routes>
  );
};

export default AuthRoutes;
