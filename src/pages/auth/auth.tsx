// src/pages/auth/auth.tsx

import { createSignal } from 'solid-js';
import { LOGIN_URL, SIGNUP_URL, formFields } from '~/pages/auth/config'; // Using path alias from tsconfig.json

// Type definition for formProps
interface AuthFormProps {
  formType: 'login' | 'signup';
}

// AuthForm component
const AuthForm = (props: AuthFormProps) => {
  const [formData, setFormData] = createSignal(formFields[props.formType]);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const url = props.formType === 'login' ? LOGIN_URL : SIGNUP_URL;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(formData()),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Something went wrong');
      } else {
        // Handle successful login or signup, e.g., redirect or store user info
      }
    } catch (error) {
      setErrorMessage('Network error occurred. Please try again.');
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
          onInput={(e) => setFormData({ ...formData(), email: (e.target as HTMLInputElement).value })}
          placeholder="Email Address"
        />
        <input
          type="password"
          value={formData().password}
          onInput={(e) => setFormData({ ...formData(), password: (e.target as HTMLInputElement).value })}
          placeholder="Password"
        />
        {props.formType === 'signup' && (
          <input
            type="password"
            value={formData().confirmPassword}
            onInput={(e) => setFormData({ ...formData(), confirmPassword: (e.target as HTMLInputElement).value })}
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

// LoginForm and SignupForm components
const LoginForm = () => <AuthForm formType="login" />;
const SignupForm = () => <AuthForm formType="signup" />;

export { LoginForm, SignupForm };
