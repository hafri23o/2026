import { style, globalStyle } from '@vanilla-extract/css'
import { sprinkles } from '~/styles/styles.css' // Assuming this is the correct import path for your sprinkles utility

// Base container style for the information section
export const infoContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'onSecondaryContainer', // Assuming you have a theme with this key
  }),
  style({
    gridArea: 'info',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 'auto 1',
  }),
])

// Base styles for info items (such as title, subtitle)
const infoBase = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap', // Ensures text doesn't overflow the container
})

// Apply a global style for the child elements of infoBase to handle text overflow
globalStyle(`${infoBase} > *`, {
  textOverflow: 'ellipsis', // Ensures that overflowing text is truncated with '...'
  overflow: 'hidden', // Hides overflowing content
})

// Info styles with specific typography applied using the `sprinkles` utility
export const info = style([
  sprinkles({
    typography: 'headlineSmall', // Assuming you have this typography style defined in `sprinkles`
  }),
  infoBase, // Inherit base styles
])

// Title style with regular size (using sprinkles for typography)
export const titleRegular = sprinkles({
  typography: 'bodyLarge', // Assuming you have this typography style defined in `sprinkles`
})

// Title style with bigger size (using sprinkles for typography)
export const titleBig = sprinkles({
  typography: 'titleLarge', // Assuming you have this typography style defined in `sprinkles`
})

// Secondary text style with medium size (using sprinkles for typography)
export const secondaryInfoText = sprinkles({
  typography: 'bodyMedium', // Assuming you have this typography style defined in `sprinkles`
})

// Style for the favorite button (aligned to the right side)
export const infoFavoriteBtn = style({
  marginLeft: 'auto', // Push the button to the right using margin
})
