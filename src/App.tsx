import { Router } from '@solidjs/router'
import { AuthProvider } from './context/AuthContext'
import { ROUTES } from './pages/app/routes'

export default function App() {
  return (
    <AuthProvider>
      <Router>{ROUTES}</Router>
    </AuthProvider>
  )
}
