import { style } from '@vanilla-extract/css' // Vanilla Extract for CSS in JS
import { sharedStyles, sprinkles } from '~/styles/styles.css' // Import styles and sprinkles using alias '~'

// Extracting flatButton from sharedStyles for consistent button style
export const { flatButton } = sharedStyles

// Base style for the modal to ensure consistent styling across all modals
const modalBase = style({
  width: '100%',
  maxWidth: '320px',  // Max width for modal
  minHeight: '160px', // Minimum height for modal
  maxHeight: '100vh', // Maximum height to prevent overflow
  zIndex: 3,         // Set zIndex to ensure modal is on top of other content
  position: 'relative',
  gridArea: 'modal', // Grid placement for modal if used inside a grid
  pointerEvents: 'all', // Ensures the modal is interactive
})

// Modal style, extending from modalBase and adding specific styles using sprinkles
export const modal = style([
  modalBase,
  sprinkles({
    radius: '24px',          // Rounded corners
    surface: 'surface',      // Surface level style (could be defined in shared styles)
    tonalElevation: 3,       // Shadow depth
    display: 'flex',         // Use flexbox for modal layout
    flexDirection: 'column', // Modal layout as a column
    color: 'onSurface',      // Text color based on surface (could be part of theme)
  }),
])

// Header style: aligned center, with padding and a gap between items
export const header = sprinkles({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',              // Spacing between items in header
  paddingX: '24px',        // Horizontal padding
  paddingTop: '24px',      // Top padding for the header
})

// Title style for the modal header
export const title = sprinkles({
  typography: 'headlineSmall',  // Typography style for modal title
})

// Content area for the modal (could be the body section)
export const content = style([
  style({
    maxHeight: '400px',         // Limit the height of content to prevent overflow
  }),
])

// Bottom buttons section, aligned to the end of the modal
export const bottomButtons = style([
  sharedStyles.actions,         // Import actions from shared styles (could be for button layout)
  sprinkles({
    justifyContent: 'flex-end',  // Align buttons to the right (flex-end)
    paddingX: '16px',            // Horizontal padding for bottom buttons
    paddingBottom: '16px',       // Padding at the bottom of the modal
  }),
  style({
    marginTop: 'auto',           // Push buttons to the bottom of the modal (flexbox)
  }),
])
