import { style } from '@vanilla-extract/css' // Proper import for vanilla-extract styles
import { sharedStyles, sprinkles, vars } from '~/styles/styles.css' // Use ~ alias for paths

// Styles for the search box container
export const searchBox = style([
  sprinkles({
    surface: 'surface',
  }),
  style({
    border: `2px solid ${vars.colors.outline}`, // Using a color variable
    overflow: 'hidden',
    display: 'flex',
    paddingLeft: '24px',
    margin: 'auto',
    maxWidth: '420px', // Responsive design for the search box
    width: '100%',
    borderRadius: '40px', // Rounded corners for search box
  }),
])

// Styles for the search input field
export const searchInput = style([
  sharedStyles.textFieldBase, // Shared styles for text fields
  sprinkles({
    typography: 'labelLarge', // Ensuring the typography fits the design system
  }),
  style({
    height: '44px', // Fixed height for the input field
    color: 'inherit', // Inherit color from parent
  }),
])

// Spacer to ensure symmetry, matching the design
export const symmetrySpacer = style({
  maxWidth: '48px', // IconButton size + padding
  flex: 'auto 1 0', // Allow flexible sizing
})

// Hidden search button (for responsive layout or accessibility purposes)
export const searchButtonHidden = style({
  display: 'none', // Initially hiding the button
})
