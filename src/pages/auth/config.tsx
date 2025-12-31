// src/pages/auth/config.tsx

// Exporting the API URLs and form fields
export const API_URL = 'http://localhost:5000/auth';
export const LOGIN_URL = `${API_URL}/login`;
export const SIGNUP_URL = `${API_URL}/signup`;

// Ensure that formFields is exported
export const formFields = {
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
