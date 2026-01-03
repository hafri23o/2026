import { keyframes, style } from '@vanilla-extract/css'
import { sprinkles, sharedStyles, vars } from '~/styles/styles.css'
import {
  EASING_INCOMING_80,
  EASING_OUTGOING_40,
  fadeInAni,
  fadeOutAni,
} from '~/styles/shared.css'
import '~/styles/global.css'

// Ensure that shared styles are correctly imported and applied
export const { interactable } = sharedStyles

// Main container for the app, with responsive behavior
export const appContainer = style({
  height: '100%',
  width: '100%',
  overflow: 'hidden',
  position: 'relative',
  selectors: {
    'html[app-not-supported] &': {
      display: 'none',
    },
  },
})

// Container for the pages, ensuring full height and width
export const pages = style({
  height: '100%',
  width: '100%',
})

// Styles for the bottom overlay, using sprinkles for layout
export const bottomOverlay = style([
  sprinkles({
    gap: '8px',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    alignItems: 'center',
    overflow: 'hidden',
  }),
  style({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    zIndex: 2,
    transition: 'transform .2s',
    pointerEvents: 'none',
    scrollbarGutter: 'stable',
  }),
])

// Class for the bottom navbar visibility toggle
export const bottomNavBarVisible = style({
  transform: 'translateY(-64px)',
})

// Loading indicator styles, hidden by default
export const loadingIndicator = style({
  position: 'absolute',
  top: '0',
  width: '100%',
  height: '4px',
  zIndex: 1,
  background: vars.colors.surfaceVariant,
  display: 'none',
})

// Keyframes for loading animations
const loadingAppearAni = keyframes({
  from: {
    opacity: 0,
  },
})

const loadingAni = keyframes({
  to: {
    transform: 'translateX(100%)',
  },
})

// Styles for when the loading indicator is enabled
export const loadingIndicatorEnabled = style({
  display: 'block',
  animation: `${loadingAppearAni} .2s .4s both`,
  ':before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    transform: 'translateX(-100%)',
    background: vars.colors.primary,
    animation: `${loadingAni} .8s .4s infinite`,
  },
})

// Keyframes for item animations (enter/exit)
const itemEnterAni = keyframes({
  from: {
    transform: 'translateY(40px)',
  },
})

const itemExitAni = keyframes({
  to: {
    transform: 'translateY(40px)',
  },
})

// Styles for when an item enters
export const itemEnter = style({
  animation: `
    ${itemEnterAni} 150ms ${EASING_INCOMING_80},
    ${fadeInAni} 100ms linear
  `,
})

// Styles for when an item exits
export const itemExit = style({
  animation: `
    ${itemExitAni} 150ms ${EASING_OUTGOING_40},
    ${fadeOutAni} 100ms 50ms linear
  `,
})
