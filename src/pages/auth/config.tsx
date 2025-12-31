// src/pages/auth/config.tsx

// Exporting the API URLs and form fields
const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL is not defined')
}

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
