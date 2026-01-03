import { style } from '@vanilla-extract/css'  // Ensure this import is correct based on your dependencies
import { sharedStyles, vars, sprinkles } from '~/styles/styles.css' // Path alias used here

// Subheader styling with typography 'titleMedium'
export const subheader = sprinkles({
  typography: 'titleMedium',
})

// Container for chips, with overflow handling and custom scroll style
export const chipsContainer = style([
  sharedStyles.actions,  // Applying shared styles for actions
  sprinkles({
    paddingX: '16px',  // Horizontal padding from sprinkles
  }),
  style({
    overflowX: 'auto',  // Allow horizontal scrolling
    flexShrink: 0,  // Prevent shrinking
    scrollbarWidth: 'thin',  // Thin scrollbar
  }),
])

// Individual chip styling with appearance and padding adjustments
export const chip = style([
  sharedStyles.interactable,  // Shared interactable styles
  sprinkles({
    radius: '8px',  // Border radius from sprinkles
    paddingRight: '16px',
    paddingLeft: '8px',
    display: 'flex',  // Flexbox layout for children
    alignItems: 'center',  // Center items vertically
    gap: '8px',  // Spacing between items
    color: 'onSurfaceVariant',  // Text color
    typography: 'labelLarge',  // Font style
  }),
  style({
    WebkitAppearance: 'none',  // Remove default styling in WebKit
    MozAppearance: 'none',  // Remove default styling in Mozilla
    appearance: 'none',  // Standardize appearance across browsers
    border: `1px solid ${vars.colors.outline}`,  // Border using vars from vanilla-extract
    fontFamily: 'inherit',  // Inherit font family
    background: 'transparent',  // Transparent background
    height: '32px',  // Fixed height for the chip
  }),
])

// Chip selected state styling
export const chipSelected = style({
  backgroundColor: vars.colors.secondaryContainer,  // Use vars for dynamic theming
  color: vars.colors.onSecondaryContainer,  // Adjust text color for selected chip
  borderColor: 'transparent',  // Remove border in selected state
})

// Icon inside the chip, with animation for scaling
export const chipIcon = style({
  width: '18px',  // Set width of the icon
  height: '18px',  // Set height of the icon
  marginRight: '-18px',  // Adjust position relative to chip
  transform: 'scale(0)',  // Start with no scaling
  transition: 'all .2s ease-in-out',  // Smooth transition on state change
  selectors: {
    [`${chipSelected} &`]: {  // When chip is selected, adjust the icon
      transform: 'none',  // Reset scale
      marginRight: '0',  // Reset margin
    },
  },
})

// Title for results section, styled with typography and padding
export const resulsTitle = style([
  sprinkles({
    typography: 'titleMedium',  // Apply titleMedium typography
    paddingTop: '24px',  // Padding from the top
    paddingLeft: '16px',  // Left padding for alignment
  }),
  style({
    selectors: {
      '&:first-letter': {
        textTransform: 'capitalize',  // Capitalize the first letter of the title
      },
    },
  }),
])
