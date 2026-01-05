import { style } from '@vanilla-extract/css'
import { vars, sprinkles } from '~/styles/styles.css' // Ensure correct path aliasing with `~`

// Style for the music image element, applying flexbox and custom styles
export const musicImage = style([
  sprinkles({
    flexShrink: 0, // Ensures the image doesn't shrink in flex containers
  }),
  style({
    borderRadius: 'max(8px, 20%)', // Dynamic border-radius for different screen sizes
    backgroundSize: 'cover', // Ensures the background image covers the container
    backgroundPosition: 'center', // Centers the background image
    fill: vars.colors.tertiary, // Uses the tertiary color from `vars`
    backgroundColor: `rgba(${vars.colors.primaryRgb}, .02)`, // Semi-transparent background using primary color
    boxShadow: `inset 0 0 0 1px rgba(${vars.colors.primaryRgb}, .2)`, // Subtle inset shadow effect
  }),
])

// Style for a round element, like a circular image or icon
export const round = style({
  borderRadius: '50%', // Fully rounds the element to create a circle
})
