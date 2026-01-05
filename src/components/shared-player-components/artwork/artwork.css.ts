import { style } from '@vanilla-extract/css'

// Define styles for the artwork
export const artwork = style({
  transition: 'background-image 0.2s ease-in-out', // Adding a smoother transition
  backgroundPosition: 'center',  // Center the background
  backgroundSize: 'cover',      // Ensure the background image covers the element's area
})
