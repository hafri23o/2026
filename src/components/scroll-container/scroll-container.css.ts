import { style } from '@vanilla-extract/css'
import { sharedStyles, vars, sprinkles } from '~/styles/styles.css' // Path alias ~ used for styles

// Base styles for the scroll container
export const scrollContainer = style([
  sharedStyles.scrollContainer,
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '16px',
    alignItems: 'center',
  }),
  style({
    height: '100%',
    width: '100%',
    scrollbarGutter: 'stable', // Ensures stable scrollbar behavior
  }),
])

// Style for scroll observer, likely used for detecting scroll events
export const scrollObserver = style({
  position: 'absolute',
  top: 0,
  height: 0,
  width: '100%',
})

// Overlay style for player, to account for the player card offset in scroll behavior
export const playerOverlay = style({
  paddingBottom: `${vars.sizes.playerCardOffset} !important`,
  scrollPaddingBottom: vars.sizes.playerCardOffset, // Ensures proper scroll padding
})

// Spacer for the player overlay to ensure consistent sizing
export const playerOverlaySpacer = style({
  height: vars.sizes.playerCardHeight,
  flexShrink: 0, // Prevents shrinking of the spacer
})

// Content sizing with flexibility and responsive design
export const contentSizer = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingY: '16px',
    paddingX: '8px',
  }),
  style({
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto', // Centers content
    flex: 1, // Allows content to grow and shrink
  }),
])
