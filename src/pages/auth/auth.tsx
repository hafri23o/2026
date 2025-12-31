// src/pages/auth/auth.tsx

import { createSignal } from 'solid-js';
import { LOGIN_URL, SIGNUP_URL, formFields } from './config';
import { auth } from '../../firebaseConfig'; // Import Firebase authentication
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthForm = (props) => {
  const [formData, setFormData] = createSignal(formFields[props.formType]);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (props.formType === 'login') {
      try {
        // Firebase login logic
        await signInWithEmailAndPassword(auth, formData().email, formData().password);
        // Handle successful login, e.g., redirect to another page
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong during login');
      }
    } else if (props.formType === 'signup') {
      try {
        // Firebase signup logic
        await createUserWithEmailAndPassword(auth, formData().email, formData().password);
        // Handle successful signup, e.g., redirect to login or another page
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong during signup');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div class="auth-form">
      <h2>{props.formType === 'login' ? 'Login' : 'Signup'} Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData().email}
          onInput={(e) => setFormData({ ...formData(), email: e.target.value })}
          placeholder="Email Address"
        />
        <input
          type="password"
          value={formData().password}
          onInput={(e) => setFormData({ ...formData(), password: e.target.value })}
          placeholder="Password"
        />
        {props.formType === 'signup' && (
          <input
            type="password"
            value={formData().confirmPassword}
            onInput={(e) => setFormData({ ...formData(), confirmPassword: e.target.value })}
            placeholder="Confirm Password"
          />
        )}
        <button type="submit" disabled={isSubmitting()}>
          {isSubmitting() ? 'Submitting...' : props.formType === 'login' ? 'Login' : 'Signup'}
        </button>
        {errorMessage() && <div class="error">{errorMessage()}</div>}
      </form>
    </div>
  );
};

const LoginForm = () => <AuthForm formType="login" />;
const SignupForm = () => <AuthForm formType="signup" />;

export { LoginForm, SignupForm };
