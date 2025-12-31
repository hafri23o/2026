import { Navigate } from '@solidjs/router'
import { LoginForm, SignupForm } from '../auth/auth'
import App from './App'
import ProtectedRoute from '../../components/ProtectedRoute'

export const ROUTES = [
  {
    path: '/login',
    component: LoginForm,
  },
  {
    path: '/signup',
    component: SignupForm,
  },
  {
    path: '/app',
    component: () => (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: () => <Navigate href="/login" />,
  },
]
