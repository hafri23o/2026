// src/pages/auth/auth.css.ts

import { style } from '@vanilla-extract/css'

// Styling for the authentication form container
export const authForm = style({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
})

// Styling for the input fields
export const input = style({
  padding: '12px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
})

// Styling for the submit button
export const button = style({
  padding: '12px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
})

// Styling for error messages
export const error = style({
  color: 'red',
  fontSize: '14px',
  marginTop: '10px',
})
