import { style } from '@vanilla-extract/css'  // Import vanilla-extract's style function
import { sprinkles } from '~/styles/styles.css'  // Ensure this path resolves correctly based on your tsconfig.json

// Container for the timeline section
export const timelineContainer = style([
  sprinkles({
    gap: '8px',  // space between elements
    display: 'flex',  // flex layout
    alignItems: 'center',  // vertically center the items
  }),
  style({
    gridArea: 'timeline',  // CSS Grid positioning
    height: '32px',  // Set the height of the container
  }),
])

// Time element style (likely for displaying time labels or similar)
export const time = style([
  sprinkles({
    typography: 'labelSmall',  // Use a predefined typography style
    flexShrink: 0,  // Prevent shrinking in flex layout
  }),
  style({
    pointerEvents: 'none',  // Disable interaction with the element (e.g., no hover/clicks)
    width: '30px',  // Set the width of the time element
  }),
])
