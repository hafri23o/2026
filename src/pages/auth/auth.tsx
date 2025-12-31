import { createSignal } from 'solid-js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import { useNavigate } from '@solidjs/router'

export function LoginForm() {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const navigate = useNavigate()

  const login = async () => {
    await signInWithEmailAndPassword(auth, email(), password())
    navigate('/app')
  }

  return (
    <div>
      <h1>Login</h1>
      <input placeholder="Email" onInput={e => setEmail(e.currentTarget.value)} />
      <input type="password" placeholder="Password" onInput={e => setPassword(e.currentTarget.value)} />
      <button onClick={login}>Login</button>
    </div>
  )
}

export function SignupForm() {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const navigate = useNavigate()

  const signup = async () => {
    await createUserWithEmailAndPassword(auth, email(), password())
    navigate('/app')
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <input placeholder="Email" onInput={e => setEmail(e.currentTarget.value)} />
      <input type="password" placeholder="Password" onInput={e => setPassword(e.currentTarget.value)} />
      <button onClick={signup}>Create Account</button>
    </div>
  )
}
