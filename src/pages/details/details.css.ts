import { style } from '@vanilla-extract/css'; // Import from Vanilla Extract for CSS-in-TypeScript
import { sharedStyles, sprinkles } from '~/styles/styles.css'; // Use alias `~` to import shared styles and sprinkles

// Exported styles for the component

// Destructure `tonalButton` from `sharedStyles`
export const { tonalButton } = sharedStyles;

// The `content` style block for the main wrapper
export const content = style([
  sprinkles({
    display: 'flex',
    tonalElevation: 1,
    radius: '12px',
    flexShrink: 0,
    padding: '16px',
    gap: '16px',
  }),
  style({
    '@media': {
      '(max-width: 600px)': {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
  }),
]);

// Style for the music image section
export const musicImage = style({
  height: '160px', // Ensure image maintains consistent size
});

// Title style, combining `sharedStyles` and `sprinkles` for typography and color
export const title = style([
  sharedStyles.textEclipse, // Shared style for text truncation
  sprinkles({
    typography: 'headlineMedium', // Use typography from sprinkles
    color: 'onSurface', // Color from sprinkles (should match your theme)
  }),
  style({
    whiteSpace: 'nowrap', // Prevent text from wrapping
  }),
]);

// `details` container for the secondary information
export const details = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'hidden', // Hide overflow text or content
  }),
  style({
    width: '100%', // Full width for container
  }),
]);

// Style for the secondary text (e.g., labels or other descriptive text)
export const secondary = style([
  sharedStyles.textEclipse, // Shared style for text truncation
  sprinkles({
    typography: 'labelLarge', // Label size for secondary information
    color: 'onSurfaceVariant', // Slightly different color for secondary text
  }),
]);

// Action buttons or links container, styled to stay at the bottom of the parent
export const actions = style([
  sharedStyles.actions, // Shared actions styles (assumed)
  style({
    marginTop: 'auto', // Push actions to the bottom of the container
  }),
]);
