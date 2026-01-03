// src/pages/auth/config.tsx

// Define types for form fields to ensure type safety
interface FormFields {
  email: string;
  password: string;
  confirmPassword?: string; // Only present in signup form
}

// Exporting the API URLs and form fields with proper types
export const API_URL = 'https://newmee.onrender.com/auth';
export const LOGIN_URL = `${API_URL}/login`;
export const SIGNUP_URL = `${API_URL}/signup`;

// Ensure that formFields is properly typed and exported
export const formFields: { [key in 'login' | 'signup']: FormFields } = {
  login: {
    email: '',
    password: '',
  },
  signup: {
    email: '',
    password: '',
    confirmPassword: '',
  },
};
