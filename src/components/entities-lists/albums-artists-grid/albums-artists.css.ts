import { style, createVar, globalStyle } from '@vanilla-extract/css'
import { sharedStyles, sprinkles, vars } from '~/styles/styles.css'  // Updated path alias to match tsconfig.json

export const INFO_CONTAINER_HEIGHT = 64
const SCROLLBAR_SIZE_WORST_CASE = 18
export const BOTTOM_GAP = 24
export const SIDE_GAP = 8

const stripScrollBarColor = createVar()

// Scroll container styles
export const scrollContainer = style({
  vars: {
    [stripScrollBarColor]: 'transparent',
  },
  height: `${180 + INFO_CONTAINER_HEIGHT + SCROLLBAR_SIZE_WORST_CASE}px !important`,
  width: '100%',
  display: 'flex',
  scrollbarColor: `${stripScrollBarColor} transparent`,
  paddingTop: 0,
  alignItems: 'baseline',
  selectors: {
    '&::-webkit-scrollbar-thumb': {
      background: stripScrollBarColor,
    },
    '&::-webkit-scrollbar': {
      background: 'transparent',
      height: '4px',
    },
    '&:is(:focus-within, :hover)': {
      vars: {
        [stripScrollBarColor]: vars.colors.surfaceVariant,
      },
    },
  },
})

// Grid item styles
export const gridItem = style({
  padding: `0 ${SIDE_GAP / 2}px ${BOTTOM_GAP}px`,
  outlineOffset: `-${SIDE_GAP / 2}px`,
})

// Content inside grid item
export const gridItemContent = style([
  sharedStyles.interactable,
  sprinkles({
    color: 'onSurfaceVariant',
  }),
  style({
    borderRadius: '12px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }),
])

// Artwork image styling
export const artwork = style({
  width: '100%',
})

// Info container for title and artists
const infoContainerBase = style({
  height: INFO_CONTAINER_HEIGHT,
  whiteSpace: 'nowrap',
})

export const infoContainer = style([
  sprinkles({
    typography: 'bodyMedium',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }),
  infoContainerBase,
  style({
    overflow: 'hidden',
    textAlign: 'center',
    width: '100%',
    padding: '0 12px',
  }),
])

// Ensure that text overflows with ellipsis
globalStyle(`${infoContainerBase} > *`, {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: '100%',
})

// Title styles inside the info container
export const title = sprinkles({
  typography: 'bodyLarge',
  color: 'onSurface',
})
