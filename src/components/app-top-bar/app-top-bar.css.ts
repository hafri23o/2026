import { style } from '@vanilla-extract/css'
import { sharedStyles, sprinkles, vars } from '~/styles/styles.css'  // Ensure path alias is used

// Elevated style based on tonal elevation from sprinkles
export const elavated = sprinkles({
  tonalElevation: 2,
})

// Main toolbar styling with flexbox and surface color
export const appTopBar = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  }),
  style({
    gridArea: 'toolbar',
    color: vars.colors.onSurface, // Uses the colors from vanilla-extract's vars
    width: '100%',
  }),
])

// Content section styling, using shared actions and padding
export const content = style([
  sharedStyles.actions,  // Shared styles for actions
  sprinkles({
    paddingX: '16px',
  }),
  style({
    width: '100%',
    height: vars.sizes.headerHeight,  // Using vars for height
  }),
])

// Title style, typography based on sprinkles utility
export const title = sprinkles({
  typography: 'titleLarge',  // Uses predefined typography from sprinkles
})

// Spacer to fill remaining space in flex container
export const spacer = style({
  flex: 1,  // Flex-grow to fill the available space
})
