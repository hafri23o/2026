// src/pages/auth/config.tsx

export const API_URL = 'https://newmee.onrender.com/auth';
export const LOGIN_URL = `${API_URL}/login`;
export const SIGNUP_URL = `${API_URL}/signup`;

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
