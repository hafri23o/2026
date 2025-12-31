import { createContext, useContext, createSignal, onCleanup } from 'solid-js'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../firebase'

type AuthContextType = {
  user: () => User | null
  loading: () => boolean
}

const AuthContext = createContext<AuthContextType>()

export function AuthProvider(props: any) {
  const [user, setUser] = createSignal<User | null>(null)
  const [loading, setLoading] = createSignal(true)

  const unsub = onAuthStateChanged(auth, (u) => {
    setUser(u)
    setLoading(false)
  })

  onCleanup(unsub)

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)!
}
