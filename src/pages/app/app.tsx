import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'

export default function App() {
  return (
    <div>
      <h1>App Dashboard</h1>
      <button onClick={() => signOut(auth)}>Logout</button>
    </div>
  )
}
