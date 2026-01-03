import { style } from '@vanilla-extract/css'
import { trailingSizeVar } from '~/components/list-item/list-item.css' // Updated to use path alias
import { sprinkles, sharedStyles } from '~/styles/styles.css' // Updated to use path alias

// Base container style
export const container = style({
  width: '100%',
})

// Media query breakpoints
const smallWidthMedia = '(max-width: 440px)'
const extraSmallWidthMedia = '(max-width: 256px)'

// Compact mode (e.g., to fit text such as progress/duration)
export const compact = style({
  vars: {
    [trailingSizeVar]: '80px', // Increased to accommodate progress/duration text
  },
})

// Narrow mode (smaller space for other elements)
export const narrow = style({
  vars: {
    [trailingSizeVar]: '70px', // Ensure minimum space for time display
  },
})

// Small screen mode, can be expanded as needed
export const small = style({})

// Extra small screen mode
export const extraSmall = style({})

// First column style (typically used for icons or small elements)
export const firstColumn = style([
  sprinkles({
    typography: 'bodyLarge', // Apply typography styles from sprinkles
  }),
  style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '24px',
  }),
])

// Artwork (e.g., album art) style
export const artwork = style({
  height: '40px',
  width: '40px',
  contain: 'strict',
  '@media': {
    [extraSmallWidthMedia]: {
      display: 'none', // Hide artwork on extra-small screens
    },
  },
})

// Album name style (will shrink in smaller views)
export const album = style([
  sharedStyles.textEclipse, // Using shared styles for text truncation
  style({
    flexShrink: 1, // Allow album to shrink before time
    minWidth: 0, // Allow it to shrink below content size
    selectors: {
      [`${compact} &`]: {
        display: 'none', // Hide album in compact mode to give space to time
      },
      [`${narrow} &`]: {
        display: 'none', // Hide album in narrow mode to prioritize time display
      },
    },
  }),
])

// Time display style
export const time = style([
  style({
    marginLeft: 'auto',
    flexShrink: 0,
    whiteSpace: 'nowrap', // Prevent text wrapping
    overflow: 'visible', // Ensure text is not cut off
    fontSize: '0.875rem', // Slightly smaller font on narrow screens
    '@media': {
      [smallWidthMedia]: {
        fontSize: '0.8rem', // Even smaller font for very small screens
      },
    },
  }),
])
