import { Navigate } from '@solidjs/router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute(props: any) {
  const { user, loading } = useAuth()

  if (loading()) return <div>Loading...</div>

  return user() ? props.children : <Navigate href="/login" />
}
