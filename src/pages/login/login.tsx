import { createSignal } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email(), password())
      .then((userCredential) => {
        const user = userCredential.user;
        // After successful login, mark user as logged in and redirect
        localStorage.setItem('userLoggedIn', 'true');
        navigate('/app');  // Redirect to the main app
      })
      .catch((error) => {
        setError('Invalid credentials');
        console.error("Login error: ", error);
      });
  };

  return (
    <div class="login-form">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email()}
        onInput={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password()}
        onInput={(e) => setPassword(e.target.value)}
      />
      {error() && <p style="color: red;">{error()}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
